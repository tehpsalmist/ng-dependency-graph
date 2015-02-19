angular.module('app')
  .directive('arGraph', function(appDeps, dev, Component) {
    'use strict';

    return {
      link: function(scope, elm, attrs) {


        // Compute the distinct nodes from the links.
        // links.forEach(function(link) {
        //   link.source = nodes[link.source] || (nodes[link.source] = {
        //     name: link.source
        //   });
        //   link.target = nodes[link.target] || (nodes[link.target] = {
        //     name: link.target
        //   });
        // });
        // 
        
        var currentGraph = scope.currentGraph;

        var links = currentGraph.links,
          nodes = currentGraph.nodes;

        var width = 1300,
          height = 500;

        var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([width, height])
          .linkDistance(80)
          .charge(-100)
          .on('tick', tick)
          .start();        


          //d3.select(elm[0])


        var svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height);

        var link = svg.selectAll('.link')
          .data(force.links())
          .enter().append('line')
          .attr('class', 'link');

        var node = svg.selectAll('.node')
          .data(force.nodes())
          .enter().append('g')
          .attr('class', 'node')
          .on('mouseover', mouseover)
          .on('mouseout', mouseout)
          .call(force.drag);

        node.append('circle')
          .attr('r', 8);

        node.append('text')
          .attr('x', 12)
          .attr('dy', '.35em')
          .text(function(d) {
            return d.name;
          });

        function tick() {
          link
            .attr('x1', function(d) {
              return d.source.x;
            })
            .attr('y1', function(d) {
              return d.source.y;
            })
            .attr('x2', function(d) {
              return d.target.x;
            })
            .attr('y2', function(d) {
              return d.target.y;
            });

          node
            .attr('transform', function(d) {
              return 'translate(' + d.x + ',' + d.y + ')';
            });
        }

        function mouseover() {
          d3.select(this).select('circle').transition()
            .duration(750)
            .attr('r', 16);
        }

        function mouseout() {
          d3.select(this).select('circle').transition()
            .duration(750)
            .attr('r', 8);
        }



      }

    };


  });