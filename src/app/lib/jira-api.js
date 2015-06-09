/**
 * chrome-jironimo
 *
 * @author Kanstantsin Kamkou <2ka.by>
 * @{@link http://github.com/kkamkou/chrome-jironimo}
 * @license http://opensource.org/licenses/BSL-1.0 Boost Software License 1.0
 */

angular
  .module('jironimo.jira', ['jironimo.settings'])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $rootScope) {
      return {
        responseError: function (rej) {
          var messages = [
            'Unknown response from the JIRA&trade; API',
            'Please check the settings!'
          ],
          loginReason = rej.headers()['x-seraph-loginreason'],
          loginReasonSet = {
            AUTHENTICATION_DENIED: 'The user is not allowed to even attempt a login.',
            AUTHENTICATED_FAILED: 'The user could not be authenticated.',
            AUTHORISATION_FAILED: 'The user could not be authorised.',
            OUT: 'The user has in fact logged "out"'
          };

          // error messages
          if (rej.headers()['x-authentication-denied-reason']) {
            messages = [rej.headers()['x-authentication-denied-reason']];
          } else if (loginReason && rej.status > 400 && rej.status < 500) {
            messages = [loginReasonSet[loginReason]];
          } else if (rej.status === 500) {
            messages = [
              'Check the JIRA&trade; configuration. Make sure the "Allow Remote API Calls"' +
              ' is turned ON under Administration > General Configuration.'
            ];
          } else if (rej.data && rej.data.errorMessages) {
            messages = rej.data.errorMessages;
          }

          // debug information
          console.error('Exception:', rej);

          // custom message
          $rootScope.$emit('jiraRequestFail', [rej.statusText, messages]);

          return $q.reject(rej);
        }
      };
    });
  })
  .service('cjJira', function ($rootScope, cjSettings, $http) {
    var cache = {},
      config = cjSettings.account;

    /**
     * Currently logged user
     *
     * @public
     * @param {Function} callback
     */
    this.myself = function (callback) {
      if (cache.myself) {
        return callback(null, cache.myself);
      }

      this._makeRequest('/api/latest/myself', {}, function (err, data) {
        if (!err) {
          cache.myself = data;
        }
        callback(err, data);
      });
    };

    /**
     * Searches for issues using JQL
     *
     * @public
     * @param {Object} data
     * @param {Function} callback
     */
    this.search = function (data, callback) {
      this._makeRequest('/api/latest/search', data, callback);
    };

    /**
     * Returns the favourite filters of the logged-in user
     *
     * @public
     * @param {Function} callback
     */
    this.filterFavourite = function (callback) {
      this._makeRequest('/api/latest/filter/favourite', {}, callback);
    };

    /**
     * Assigns an issue to a user
     *
     * @param {Number} issueId
     * @param {String} userName
     * @param {Function} callback
     */
    this.issueAssignee = function (issueId, data, callback) {
      this._makeRequest(
        '/api/latest/issue/' + issueId + '/assignee', data, callback
      );
    };

    /**
     * Adds a new worklog entry to an issue
     *
     * @param {Number} issueId
     * @param {Object} data
     * @param {Function} callback
     */
    this.issueWorklog = function (issueId, data, callback) {
      this._makeRequest(
        '/api/latest/issue/' + issueId + '/worklog?adjustEstimate=auto',
        data, callback
      );
    };

    /**
     * Perform a transition on an issue
     *
     * @param {Number} issueId
     * @param {Object} data
     * @param {Function} callback
     */
    this.transitions = function (issueId, data, callback) {
      this._makeRequest(
        '/api/latest/issue/' + issueId + '/transitions?expand=transitions.fields',
        data, callback
      );
    };

    /**
     * Makes request with the data set
     *
     * @param {String} urn
     * @param {Object} dataSet
     * @param {Function} callback
     * @private
     */
    this._makeRequest = function (urn, dataSet, callback) {
      if (!config.url || !config.login) {
        return callback(new Error('JIRA url and login are required for the service'));
      }

      var callOptions = {
        method: 'GET',
        url: config.url + '/rest' + urn,
        cache: false,
        data: dataSet,
        responseType: 'json',
        timeout: config.timeout * 1000,
        headers: {
          ContentType: 'application/json; charset=UTF-8',
          Authorization: 'Basic ' + window.btoa([config.login, config.password].join(':'))
        }
      };

      // different method
      if (callOptions.data._method) {
        callOptions.method = callOptions.data._method.toUpperCase();
        delete callOptions.data._method;
      }

      // angular params;data fix
      if (callOptions.method === 'GET') {
        callOptions.params = callOptions.data;
        delete callOptions.data;
      }

      // ajax object
      $http(callOptions)
        .success(function (json) {
          return callback(null, json);
        })
        .error(function (err) {
          return callback(new Error(err || 'Connection problem'));
        });
    };
  });
