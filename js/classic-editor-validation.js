//https://codex.wordpress.org/Plugin_API/Filter_Reference/mce_external_plugins

jQuery(document).ready(function($){
    console.log("classic editor js is loaded");
    $("#publish").on('click', function(e) {
        e.preventDefault();
        console.log("publish clicked");
        if ($("input[type='text'][name='post_title']").html === "") {
            console.log("title is empty");
            console.log("plugin options", PV_options);
        }
    });
}(jQuery));