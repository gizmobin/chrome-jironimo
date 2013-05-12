/**
 * chrome-jironimo
 *
 * @author Kanstantsin Kamkou <2ka.by>
 * @{@link http://github.com/kkamkou/chrome-jironimo}
 * @license http://opensource.org/licenses/BSL-1.0 Boost Software License 1.0 (BSL-1.0)
 */
function IndexController($q, $scope, cjTimer, cjSettings, cjJira) {
  // context storing
  var self = this;

  // workspaces
  $scope.workspaces = cjSettings.workspaces;

  // timer
  $scope.timer = cjTimer;

  // the active workspace
  $scope.workspaceActive = _.find($scope.workspaces, function (dataSet) {
    return dataSet.isDefault;
  });

  /**
   * Loads issues for an another workspace
   *
   * @return {*}
   */
  $scope.workspaceRefresh = function () {
    // displaying the loader
    $scope.loading = true;

    // issues cleanup
    $scope.issues = [];

    // deffering issues
    self._issuesSearch($scope.workspaceActive.query)
      .then(
        function (issues) {
          self._issuesModify(issues);
          $scope.loading = false;
        },
        function () {
          $scope.loading = false;
        }
      );

    // refresh interval
    if (cjSettings.timer.workspace > 0) {
      setTimeout(
        $scope.workspaceRefresh,
        parseInt(cjSettings.timer.workspace, 10) * 1000 * 60
      );
    }
  };

  /**
   * Makes another workspace active
   *
   * @param {Number} index
   */
  $scope.workspaceSwitchTo = function (index) {
    $scope.workspaceActive = $scope.workspaces[index]
      ? $scope.workspaces[index]
      : $scope.workspaces[0];
    $scope.workspaceRefresh();
  };

  /**
   * Executes transition for the current ticket
   *
   * @param {Object} issue
   * @param {Object} transition
   * @return false
   */
  $scope.transition = function (issue, transition) {
    // we have no transition
    if (!issue) {
      $(event.target).parent().hide();
      return false;
    }

    // the data object
    var dataSet = {
      _method: 'post',
      transition: {id: transition.id}
    };

    // lets update the entry
    cjJira.transitions(issue.id, dataSet, function (err) {
      if (!err) {
        $scope.workspaceRefresh();
      }
    });

    return false;
  };

  /**
   * Opens issue in the JIRA
   *
   * @param {Number} index
   * @return {Boolean}
   */
  $scope.tabOpen = function (index) {
    chrome.tabs.create({
      active: false,
      url: cjSettings.account.url +
        '/browse/' + $scope.issues[index].key
    });
    return false;
  };

  /**
   * Entry set corrections
   *
   * @param {Array} issues
   * @return {*}
   */
  this._issuesModify = function (issues) {
    angular.forEach(issues, function (issue) {
      // the closed status
      issue._isClosed = (issue.fields.status.name === 'Closed');

      // timeestimate
      if (issue.fields.timeestimate) {
        issue.fields.timeestimate = moment
          .duration(issue.fields.timeestimate * 1000).humanize();
      }

      // applying custom colors
      issue._colors = cjSettings.colors.priority[issue.fields.priority.id]
        ? cjSettings.colors.priority[issue.fields.priority.id]
        : cjSettings.colors.priority[0];

      // lets load some transitions
      cjJira.transitions(issue.id, {}, function (err, data) {
        if (!err && data.transitions) {
          $scope.$apply(function () {
            issue._transitions = data.transitions;
          });
        }
      });

      // updating the ui
      $scope.issues.push(issue);
    });
  };

  /**
   * Loads issues from the API
   *
   * @param {String} query
   * @private
   * @return {Object}
   */
  this._issuesSearch = function (query) {
    // defaults
    var deferred = $q.defer();

    // auth check
    cjJira.isAuthenticated(function (err, flag) {
      // user is not authorized
      if (!flag) {
        return false;
      }

      // content update after
      cjJira.search(query, function (err, data) {
        $scope.$apply(function () {
          return err ? deferred.reject(err) : deferred.resolve(data.issues);
        });
      });
    });

    return deferred.promise;
  };

  // DOM playground(should be moved somewhere)
  $scope.$on('$viewContentLoaded', function () {
    var $tiles = $('div.tiles');

    $tiles.on('click', 'div.tile', function () {
      $tiles.find('div.toolbar:visible').slideUp('fast');
      $(this).find('div.toolbar:not(:visible)').slideDown('fast');
      return false;
    });

    $tiles.on('click', 'button.transitions', function () {
      $(this).closest('div.tile').find('div.transitions').show();
      return false;
    });

    $scope.workspaceRefresh();
  });
}