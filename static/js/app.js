function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const metadata = data.metadata;

    const sampleData = metadata.find(entry => entry.id == sample);

    const panel = d3.select("#sample-metadata");
    panel.html("");  // Clear any previous content

    if (sampleData) {
      Object.entries(sampleData).forEach(([key, value]) => {
        panel.append("p").text(`${key.toUpperCase()}: ${value}`);
      });
    }
  });
}
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const samples = data.samples;
    const sampleInfo = samples.find(entry => entry.id == sample);

    const otu_ids = sampleInfo.otu_ids;
    const sample_values = sampleInfo.sample_values;
    const otu_labels = sampleInfo.otu_labels;

    // Bubble Chart Data
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      margin: { t: 0 },
      hovermode: "closest",
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Bar Chart Data
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barTrace = {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const sampleNames = data.names;

    const selector = d3.select("#selDataset");

    sampleNames.forEach(sample => {
      selector.append("option").text(sample).property("value", sample);
    });

    const initialSample = sampleNames[0];
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();
