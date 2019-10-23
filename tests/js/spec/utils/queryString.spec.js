import utils from 'app/utils/queryString';

describe('addQueryParamsToExistingUrl', function() {
  it('adds new query params to existing query params', function() {
    const url = 'https://example.com?value=3';
    const newParams = {
      id: 4,
    };
    expect(utils.addQueryParamsToExistingUrl(url, newParams)).toBe(
      'https://example.com/?id=4&value=3'
    );
  });

  it('adds new query params without existing query params', function() {
    const url = 'https://example.com';
    const newParams = {
      id: 4,
    };
    expect(utils.addQueryParamsToExistingUrl(url, newParams)).toBe(
      'https://example.com/?id=4'
    );
  });

  it('returns empty string no url is passed', function() {
    let url;
    const newParams = {
      id: 4,
    };
    expect(utils.addQueryParamsToExistingUrl(url, newParams)).toBe('');
  });
});

describe('addKeyValueToQueryString', function() {
  let locationQuery;

  it('adds to Query', function() {
    locationQuery = {};
    const result = utils.addKeyValueToQueryString(locationQuery, 'color', 'red');

    expect(result).toEqual({color: 'red'});
  });

  it('adds to Query with null', function() {
    locationQuery = {color: null};
    const result = utils.addKeyValueToQueryString(locationQuery, 'color', 'red');

    expect(result).toEqual({color: 'red'});
  });

  it('wraps values with spaces', function() {
    locationQuery = {};
    const result = utils.addKeyValueToQueryString(locationQuery, 'color', 'green red');

    expect(result).toEqual({color: '"green red"'});
  });

  it('adds to Query by replacing existing values', function() {
    locationQuery = {color: 'green'};
    const result = utils.addKeyValueToQueryString(locationQuery, 'color', 'red');

    expect(result).toEqual({color: 'red'});
  });

  it('uses addKeyValueToQueryStringQuery appending to Query.query', function() {
    locationQuery = {color: 'red', query: 'red'};
    const result = utils.addKeyValueToQueryString(locationQuery, 'query', 'green');

    expect(result).toEqual({color: 'red', query: 'red green'});
  });

  it('does not error out if query is undefined', function() {
    locationQuery = undefined;
    const result = utils.addKeyValueToQueryString(locationQuery, 'color', 'red');

    expect(result).toEqual({color: 'red'});
  });
});

describe('addKeyValueToQueryStringQuery', function() {
  let locationQuery;

  it('adds key-value to Query.query', function() {
    locationQuery = {};
    const result = utils.addKeyValueToQueryStringQuery(locationQuery, 'red');

    expect(result).toEqual({query: 'red'});
  });

  it('wraps key-value that has spaces', function() {
    locationQuery = {};
    const result = utils.addKeyValueToQueryStringQuery(locationQuery, 'green red');

    expect(result).toEqual({query: '"green red"'});
  });

  it('adds key-value to Query.query, replacing existing key-value pairs with the same key', function() {
    locationQuery = {query: 'color:green taste:sweet color:pink'};
    const result = utils.addKeyValueToQueryStringQuery(locationQuery, 'color:red');

    expect(result).toEqual({query: 'color:red taste:sweet'});
  });

  it('adds key-value to Query.query by appending if it has no keys', function() {
    locationQuery = {query: 'green'};
    const result = utils.addKeyValueToQueryStringQuery(locationQuery, 'red');

    expect(result).toEqual({query: 'green red'});
  });
});
