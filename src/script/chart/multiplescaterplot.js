(function() {
    var multipleScaterplot = {
        render: function(target, data, config) {
          var width = 300,
              size = 150,
              padding = 20;

          var x = d3.scale.linear()
              .range([padding / 2, size - padding / 2]);

          var y = d3.scale.linear()
              .range([size - padding / 2, padding / 2]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(6);

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(6);

          var color = d3.scale.category10();

          var domainByTrait = {},
              traits = d3.keys(data[0]).filter(function(d) {
                  for (var idListIndex = 0; idListIndex < config.nominalValue.idList.length; idListIndex = idListIndex + 1) {
                      if (config.nominalValue.idList[idListIndex] === d) {
                          return false;
                      }
                  }
                  return true;
              }),
              n = traits.length;

          traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
          });

          xAxis.tickSize(size * n);
          yAxis.tickSize(-size * n);

          var svg = d3.select(target).append("svg")
          .attr("width", size * n + 4 * padding)
          .attr("height", size * n + 4 * padding)
          .append("g")
          .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

          svg.selectAll(".x.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "x axis")
            .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
            .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

          svg.selectAll(".y.axis")
            .data(traits)
            .enter().append("g")
            .attr("class", "y axis")
            .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
            .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

          var cell = svg.selectAll(".cell")
          .data(window.util.cross(traits, traits))
          .enter().append("g")
          .attr("class", "cell")
          .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
          .each(plot);

          // Titles for the diagonal.
          cell.filter(function(d) { return d.i === d.j; }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) { return d.x; });

          function plot(p) {
            var cell = d3.select(this);

            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);

            cell.append("rect")
              .attr("class", "frame")
              .attr("x", padding / 2)
              .attr("y", padding / 2)
              .attr("width", size - padding)
              .attr("height", size - padding);

            cell.selectAll("circle")
              .data(data)
              .enter().append("circle")
              .attr("cx", function(d) { return x(d[p.x]); })
              .attr("cy", function(d) { return y(d[p.y]); })
              .attr("r", 4)
              .style("fill", function(d) { return color(d[config.nominalValue.idToShow]);});
          }
        }
    };

    window.multipleScaterplot = multipleScaterplot;
})();