// gapminder code from plotly example - https://plotly.com/javascript/gapminder-example/

d3.csv('./data/Life.csv').then(function (data) {
    console.log(data);
    // Create a lookup table to sort and regroup the columns of data,
    // first by Year, then by region:
    var rows = data
    console.log(rows)

    var lookup = {};
    function getData(Year, region) {
        var byYear, trace;
        if (!(byYear = lookup[Year])) {
            ;
            byYear = lookup[Year] = {};
        }
        // If a container for this Year + region doesn't exist yet,
        // then create one:
        if (!(trace = byYear[region])) {
            trace = byYear[region] = {
                yr: [],
                rgn: [],
                x: [],
                y: [],
                id: [],
                text: [],
                marker: { size: [] }
            };
        }
        // console.log(trace);
        return trace;
    }

    var chloro = {};
    function getDataGraph(Year) {
        var byYear, trace;
        if (!(byYear = chloro[Year])) {
            ;
            byYear = chloro[Year] = {};
        }
        // If a container for this Year + region doesn't exist yet,
        // then create one:
        // if (!(trace = byYear[region])) {
        //     trace = {
        //         yr: [],
        //         rgn: [],
        //         x: [],
        //         y: [],
        //         id: [],
        //         text: [],
        //         marker: { size: [] }
        //     };
        // }
        // console.log(trace);
        return trace;
    }

    // Go through each row, get the right trace, and append the data:
    for (var i = 0; i < data.length; i++) {
        var datum = data[i];
        var trace = getData(datum.Year, datum.region);
        trace.yr.push(datum.Year);
        trace.rgn.push(datum.region);
        trace.text.push(datum.Country);
        trace.id.push(datum.Country);
        trace.x.push(datum.Life_Expectancy);
        trace.y.push(datum.GDP);
        trace.marker.size.push(datum.Population);
    }

    // Get the group names:
    var Years = Object.keys(lookup);
    // In this case, every Year includes every region, so we
    // can just infer the regions from the *first* Year:
    var firstYear = lookup[Years[0]];
    var regions = Object.keys(firstYear);

    console.log(regions)

    // Create the main traces, one for each region:
    var traces = [];
    for (i = 0; i < regions.length; i++) {
        var data = firstYear[regions[i]];
        // One small note. We're creating a single trace here, to which
        // the frames will pass data for the different Years. It's
        // subtle, but to avoid data reference problems, we'll slice 
        // the arrays to ensure we never write any new data into our
        // lookup table:
        traces.push({
            name: regions[i],
            x: data.x.slice(),
            y: data.y.slice(),
            id: data.id.slice(),
            text: data.text.slice(),
            mode: 'markers',
            marker: {
                size: data.marker.size.slice(),
                sizemode: 'area',
                sizeref: 200000
            }
        });
    }
    console.log(traces)

    // Create a frame for each Year. Frames are effectively just
    // traces, except they don't need to contain the *full* trace
    // definition (for example, appearance). The frames just need
    // the parts the traces that change (here, the data).
    var frames = [];
    for (i = 0; i < Years.length; i++) {
        frames.push({
            name: Years[i],
            data: regions.map(function (region) {
                return getData(Years[i], region);
            })
        });
    }
    console.log(frames)
    
    // var pic = [];
    // for (i = 0; i < Years.length; i++) {
    //     pic.push({
    //         name: Years[i],
    //         data: regions.map(function (region) {
    //             return getDataGraph(Years[i]);
    //         })
    //     });
    // }
    // console.log(pic)

    // Now create slider steps, one for each frame. The slider
    // executes a plotly.js API command (here, Plotly.animate).
    // In this example, we'll animate to one of the named frames
    // created in the above loop.
    var sliderSteps = [];
    for (i = 0; i < Years.length; i++) {
        sliderSteps.push({
            method: 'animate',
            label: Years[i],
            args: [[Years[i]], {
                mode: 'immediate',
                transition: { duration: 300 },
                frame: { duration: 300, redraw: false },
            }]
        });
    }

    var layout = {
        xaxis: {
            title: 'Life Expectancy',
            range: [30, 85]
        },
        yaxis: {
            title: 'GDP per Capita',
            type: 'log'
        },
        hovermode: 'closest',
        //         // We'll use updatemenus (whose functionality includes menus as
        //         // well as buttons) to create a play button and a pause button.
        //         // The play button works by passing `null`, which indicates that
        //         // Plotly should animate all frames. The pause button works by
        //         // passing `[null]`, which indicates we'd like to interrupt any
        //         // currently running animations with a new list of frames. Here
        //         // The new list of frames is empty, so it halts the animation.
        updatemenus: [{
            x: 0,
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 300 },
                    frame: { duration: 500, redraw: false }
                }],
                label: 'Play'
            }, {
                method: 'animate',
                args: [[null], {
                    mode: 'immediate',
                    transition: { duration: 0 },
                    frame: { duration: 0, redraw: false }
                }],
                label: 'Pause'
            }]
        }],
        //         // Finally, add the slider and use `pad` to position it
        //         // nicely next to the buttons.
        sliders: [{
            pad: { l: 130, t: 55 },
            currentvalue: {
                visible: true,
                prefix: 'Year:',
                xanchor: 'right',
                font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
        }]
    };


    // Create the plot:
    Plotly.plot('bubble_plot_country', {
        data: traces,
        layout: layout,
        config: { showSendToCloud: true },
        frames: frames,
    });
    console.log(frames)

    // var rows = data
    // console.log(rows)

    function unpack(rows, key, year) {
        var row_year = rows.filter(t => t.Year == year)
        return row_year.map(function(row) { return row[key]; });
    }

    // var rows = data

    var sliderSteps2 = [];
    for (i = 0; i < Years.length; i++) {
        sliderSteps2.push({
            method: 'animate',
            label: Years[i],
            args: [[Years[i]], {
                mode: 'immediate',
                transition: { duration: 300 },
                frame: { duration: 300, redraw: false },
            }]
        });
    }

    var traces = [];
    for (i = 0; i < regions.length; i++) {
        var data = firstYear[regions[i]];
        // One small note. We're creating a single trace here, to which
        // the frames will pass data for the different Years. It's
        // subtle, but to avoid data reference problems, we'll slice 
        // the arrays to ensure we never write any new data into our
        // lookup table:
        console.log(data)
        traces.push({
            name: regions[i],
            x: data.x.slice(),
            y: data.y.slice(),
            id: data.id.slice(),
            text: data.text.slice(),
            type: 'choropleth',
            locationmode: 'country names',
            locations: unpack(rows, 'Country'),
            z: unpack(rows, 'Life_Expectancy'),
            text: unpack(rows, 'Country'),
            locations: data.text.slice(),
            z: data.x.slice(),
            text: data.text.slice(),
            autocolorscale: true
        });
        console.log(traces)
    }

    var data_year = {
        type: 'choropleth',
        locationmode: 'country names',
        locations: unpack(rows, 'Country',2000),
        z: unpack(rows, 'Life_Expectancy',2000),
        text: unpack(rows, 'Country', 2000),
        autocolorscale: true
    };

    data_map = []

    for(var i = 2000; i <= 2015; i++ ) {
        var entry = {}
        var data_year = {
            type: 'choropleth',
            locationmode: 'country names',
            locations: unpack(rows, 'Country', i),
            z: unpack(rows, 'Life_Expectancy', i),
            text: unpack(rows, 'Country', i),
            autocolorscale: true
        };
        entry["name"] = i
        entry["data"] = i
        data_map.push(data_year)
    }

//   var data_map = [{
//       type: 'choropleth',
//       locationmode: 'country names',
//       locations: unpack(rows, 'Country'),
//       z: unpack(rows, 'Life_Expectancy'),
//       text: unpack(rows, 'Country'),
//       autocolorscale: true
//   }];
  console.log(data_map)

  var layout_map = {
    title: 'Life Expectancy for 2015 across the world',
    geo: {
        projection: {
            type: 'robinson'
        }
    },
    updatemenus: [{
      x: 0,
      y: 0,
      yanchor: 'top',
      xanchor: 'left',
      showactive: false,
      direction: 'left',
      type: 'buttons',
      pad: { t: 87, r: 10 },
      buttons: [{
          method: 'animate',
          args: [null, {
              mode: 'immediate',
              fromcurrent: true,
              transition: { duration: 300 },
              frame: { duration: 500, redraw: false }
          }],
          label: 'Play'
      }, {
          method: 'animate',
          args: [[null], {
              mode: 'immediate',
              transition: { duration: 0 },
              frame: { duration: 0, redraw: false }
          }],
          label: 'Pause'
      }]
  }],
  //         // Finally, add the slider and use `pad` to position it
  //         // nicely next to the buttons.
  sliders: [{
      pad: { l: 130, t: 55 },
      currentvalue: {
          visible: true,
          prefix: 'Year:',
          xanchor: 'right',
          font: { size: 20, color: '#666' }
      },
      steps: sliderSteps2
  }]
  };

//   Plotly.newPlot("choropleth", traces, layout_map, {showLink: false},frames: frames);
  Plotly.plot("choropleth", {
    data: [data_year],
    layout: layout_map,
    config: { showSendToCloud: true },
    frames: data_map,
});
});


// 3rd visualisation - world map
