// Main data js file. Calls the functions from other files to run the data page.

var element = d3.select(".bar_chart");

var data_manager = new Data_Manager();

var options = {
    data: data_manager.get_data(),
    element,
}

var bar_chart = new Bar_Chart(options);
bar_chart.draw();
