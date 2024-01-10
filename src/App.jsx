/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    с => product.categoryId === с.id,
  );
  const user = usersFromServer.find(owner => category.ownerId === owner.id);

  return {
    ...product,
    category,
    user,
  };
});

function filterByUser(query, initialProducts) {
  const { owner, productName } = query;
  const normalizedNameQuery = productName.toLowerCase();

  if (!owner && productName.length === 0) {
    return initialProducts;
  }

  return initialProducts
    .filter(({ user }) => (owner ? user.id === owner : true))
    .filter(({ name }) => (
      productName.length !== 0
        ? name.toLowerCase().includes(normalizedNameQuery)
        : true
    ));
}

const initialState = { owner: null, productName: '' };

export const App = () => {
  const [query, setQuery] = useState(initialState);
  const visibleProducts = filterByUser(query, products);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': query.owner === null })}
                onClick={() => setQuery(prev => ({ ...prev, owner: null }))}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => (
                <a
                  key={id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': query.owner === id })}
                  onClick={() => setQuery(prev => ({ ...prev, owner: id }))}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query.productName}
                  onChange={event => setQuery(prev => (
                    { ...prev, productName: event.target.value }
                  ))}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query.productName.length !== 0 && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery(prev => (
                        { ...prev, productName: '' }
                      ))}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => setQuery(initialState)}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(({ id, name, category, user }) => {
                  const { icon, title } = category;
                  const { sex } = user;

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${icon} - ${title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
          }
        </div>
      </div>
    </div>
  );
};
