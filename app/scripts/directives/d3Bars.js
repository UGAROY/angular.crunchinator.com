'use strict';

angular.module('crunchinatorApp.directives').directive('d3Bars', function() {
    return {
        restrict: 'EA',
        scope: {
            data: '='
        },
        link: function(scope, element) {
            var margin = { top: 0, right: 10, bottom: 20, left: 0 };
            var width = 470 - margin.left - margin.right;
            var height = 353 - margin.top - margin.bottom;

            var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient('bottom');

            var svg = d3.select(element[0]).append('svg')
            .style('width', width + margin.left + margin.right + 'px')
            .style('height', height + margin.top + margin.bottom + 'px')
            .style('margin', '0 auto')
            .style('display', 'block')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            window.onresize = function() {
                scope.$apply();
            };

            scope.$watch('data', function(newval) {
                return scope.render(newval);
            }, true);

            scope.$watch(function() {
                return angular.element(window)[0].innerWidth;
            }, function() {
                scope.render(scope.data);
            });

            scope.render = function(data) {
                svg.selectAll('*').remove();
                if(!data) { return; }

                var labels = _.pluck(data, 'label');
                var labelsToDisplay = [];
                for(var i = 0; i < labels.length; i++) {
                    var label = labels[i];

                    if(i % 2 === 0){
                        labelsToDisplay.push(label);
                    }
                }

                var xAxis = d3.svg.axis().scale(x).tickValues(labelsToDisplay).orient('bottom');

                x.domain(data.map(function(d) { return d.label; }));
                y.domain([0, d3.max(data, function(d) { return d.count; })]);

                svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + Math.floor(x.rangeBand() / 2) + ', ' + height + ')')
                .call(xAxis);

                svg.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) { return x(d.label); })
                .attr('width', x.rangeBand())
                .attr('y', function(d) { return y(d.count); })
                .attr('height', function(d) { return height - y(d.count); })
                .on('click', function(d) {
                    console.log(d);
                });
            };
        }
    };
});
