d3.csv('./data/Life.csv').then(function (data) {
    console.log(data);
    // Create a lookup table to sort and regroup the columns of data,
    // first by Year, then by region:
    var rows = data
    // console.log(rows)

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


    var Years = Object.keys(lookup);
    // In this case, every Year includes every region, so we
    // can just infer the regions from the *first* Year:
    var firstYear = lookup[Years[0]];
    var regions = Object.keys(firstYear);

    console.log(Years)

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

    var frames = [];
    for (i = 0; i < Years.length; i++) {
        frames.push({
            name: Years[i],
            data: regions.map(function (region) {
                return getData(Years[i], region);
            })
        });
    }
    console.log(traces)
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
            range: [0, 100]
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
        config: { responsive: true },
        frames: frames,
    });

    ////////////////////////////////////////////////////////////////



    function unpack(rows, key, year) {
        var row_year = rows.filter(t => t.Year == year)
        return row_year.map(function (row) { return row[key]; });
    }


    var traces_c = [];
    for (i = 0; i < regions.length; i++) {
        var data = firstYear[regions[i]];
        // One small note. We're creating a single trace here, to which
        // the frames will pass data for the different Years. It's
        // subtle, but to avoid data reference problems, we'll slice 
        // the arrays to ensure we never write any new data into our
        // lookup table:
        // console.log(data)
        traces_c.push({
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

    }
    console.log(traces_c)

    data_map = []
    for (var i = 2000; i <= 2015; i++) {
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

    console.log(data_map)


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

    var layout_map = {
        title: 'Life Expectancy for Year 2015 Across The World',
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
        
        }],
    };

    Plotly.plot("choropleth", {
        data: [data_year],
        layout: layout_map,
        config: { responsive: true },
        frames: data_map, frames
    });


    // Building default Box Plot:
    // Selecting HTML ID for dropdown variable.
    var dropdown = d3.select("#selDataset")
    // console.log(dropdown)
    // Setting loop for each Year to be appended in to dropdown. 
    Years.forEach((year) => {
        dropdown.append("option").text(year).property("value", year)
        // console.log(year)
    });

    d3.select("#selDataset").on('change', buildChart)

    function buildChart() {
        // Change the current key and call the function to update the colors. 
        currentKey = d3.select("#selDataset").property('value');
        // updateMapColors();
        console.log(currentKey)
        var firstYear1 = lookup[Years[parseInt(currentKey) - 2000]];
        // var firstYear1 = Years.filter(obj => obj.name == selected) 
        //  console.log(firstYear1)


        var trace_1;
        var data = firstYear1[regions[0]];
        trace_1 = data.x

        var trace_1d = {
            y: trace_1,
            type: "box",
            type: 'box',
            name: 'Asia',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
                color: 'rgb(165,15,21)'
            },
            boxpoints: 'all'
        };

        var trace_2;
        var data = firstYear1[regions[1]];
        trace_2 = data.x

        var trace_2d = {
            y: trace_2,
            type: "box",
            type: 'box',
            name: 'Europe',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
                color: 'rgb(37,52,148)'
            },
            boxpoints: 'all'
        };

        var trace_3;
        var data = firstYear1[regions[2]];
        trace_3 = data.x

        var trace_3d = {
            y: trace_3,
            type: "box",
            type: 'box',
            name: 'Africa',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
                color: 'rgb(0,104,55)'
            },
            boxpoints: 'all'
        };

        var trace_4;
        var data = firstYear1[regions[3]];
        trace_4 = data.x

        var trace_4d = {
            y: trace_4,
            type: "box",
            type: 'box',
            name: 'Americas',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
                color: 'rgb(136,86,167)'
            },
            boxpoints: 'all'
        };

        var trace_5;
        var data = firstYear1[regions[4]];
        trace_5 = data.x

        var trace_5d = {
            y: trace_5,
            type: "box",
            type: 'box',
            name: 'Oceania',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
                color: 'rgb(65,182,196)'
            },
            boxpoints: 'all'
        };


        var data = [trace_1d, trace_2d, trace_3d, trace_4d, trace_5d];

        var layout = {
            title: 'Box Plot Styling Outliers'
        };

        var config = {responsive: true}

        Plotly.newPlot('mydiv', data, layout, config);
    }
    buildChart();
});