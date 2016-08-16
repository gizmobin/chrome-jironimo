/**
 * chrome-jironimo
 *
 * @author Kanstantsin Kamkou <2ka.by>
 * @{@link http://github.com/kkamkou/chrome-jironimo}
 * @license http://opensource.org/licenses/BSL-1.0 Boost Software License 1.0
 */

'use strict';

angular
  .module('jironimo')
  .controller('SettingsController', [
    '$scope', '$location', '$filter', 'cjSettings', 'cjJira',
    function ($scope, $location, $filter, cjSettings, cjJira) {
      $scope.tabControl = {colors: 'theme'};

      $scope.notifications = [];

      angular.forEach(
        ['general', 'accounts', 'colors', 'timer', 'workspaces'],
        k => $scope[k] = cjSettings[k]
      );

      $scope.workspaceAdd = function () {
        if ($scope.workspaces.length > 10) { return; }

        $scope.workspaces.push(
          {title: null, query: null, isDefault: false, icon: 'bug'}
        );
      };

      $scope.workspaceSetAsDefault = function (workspace) {
        angular.forEach($scope.workspaces, function (entry) {
          if (entry.isDefault) {
            entry.isDefault = false;
          }
          entry.isDefault = (entry === workspace);
        });
      };

      $scope.workspaceRemove = function (workspace) {
        if (!confirm($filter('i18n')('msgGeneralActionConfirm'))) {
          return false;
        }

        if ($scope.workspaces.length < 2) { return; }

        $scope.workspaces = $scope.workspaces.filter(w => w !== workspace);

        if (workspace.isDefault) {
          $scope.workspaceSetAsDefault($scope.workspaces[0]);
        }
      };

      $scope.workspaceImport = function () {
        cjJira.filterFavourite(function (err, data) {
          if (err) {
            $scope.notifications.push({type: 'error', message: err.message});
            return;
          }

          var workspaces = _.map($scope.workspaces, 'query'),
            favs = _.map(data, 'jql'),
            count = 0;

          _.difference(favs, workspaces).forEach(function (jql) {
            count++;
            $scope.workspaces.push({
              isDefault: false,
              title: _.find(data, {jql: jql}).name,
              query: jql,
              icon: 'heart-2'
            });
          });

          $scope.notifications.push({
            type: 'success',
            message: $filter('i18n')('msgWorkspaceImportSuccess', [count])
          });
        });
      };

      $scope.workspaceQueryIsValidForWatch = function (query) {
        return (/\bupdated(date)?\b/).test(query.toLowerCase());
      };

      $scope.save = function (type, data) {
        if (!data) { return; }

        var ok = function () {
          $scope.notifications.push(
            {type: 'success', message: $filter('i18n')('msgOptionsSaveSuccess')}
          );
        };

        switch (type) {
          case 'accounts':
            data.url = data.url.replace(/\/+$/, '');
            data.timeout = parseInt(data.timeout, 10) || 10;
            chrome.permissions.request({origins: [data.url + '/']}, function (flag) {
              if (!flag) { return false; }
              cjSettings[type] = angular.copy(data);
              $scope.$apply(ok);
            });
            break;
          default:
            cjSettings[type] = angular.copy(data);
            ok();
        }
      };
    }]
  )
  .directive('navigation', function () {
    return {
      templateUrl: 'macros/options-navigation.html',
      restrict: 'E',
      scope: {current: '@'},
      controller: ['$scope', '$location', function ($scope, $location) {
        $scope.entries = [
          {icon: 'key', id: 'general', title: 'optionsGeneralTitle'},
          {icon: 'bug', id: 'jql', title: 'optionsJqlWorkspacesTitle'},
          {icon: 'sun-3', id: 'colors', title: 'optionsColorsTitle'},
          {icon: 'clock', id: 'timer', title: 'optionsTimerTitle'},
          {icon: 'info-2', id: 'about', title: 'optionsAboutTitle'}
        ];

        $scope.goTo = function (entry) {
          $location.path('/settings/' + entry.id);
          return false;
        };
      }]
    };
  });
