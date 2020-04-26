<?php // add the admin options page
add_action('admin_menu', 'plugin_admin_add_page');
function plugin_admin_add_page() {
    add_options_page('Publish Validation', 'Publish Validation', 'manage_options', 'publish_validation', 'publish_validation_options_page');
}

function publish_validation_options_page() {
    ?>
    <div class="wrap">
        <h1 class="dashicons-before dashicons-admin-generic"> Publish Validation Options</h1>
        <form action="options.php" method="POST">
            <?php settings_fields('publish_validation_options'); ?>
            <?php do_settings_sections('publish_validation'); ?>

            <input name="Submit" class='button-primary'  type="submit" value="<?php esc_attr_e('Save Changes'); ?>" />
        </form>
    </div>
<?php
}

function publish_validation_admin_init(){
    $options = get_option('PV_options');
    register_setting( 'publish_validation_options', 'PV_options', 'plugin_options_validate' );
    /** post section */
    add_settings_section('post_settings_section', '<div alt="f109" class="dashicons-before dashicons-admin-post">Post Options</div>', 'post_settings_section_output', 'publish_validation');

    add_settings_field('PV_title_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_title_req_post','Require Title on Posts']);

    /** page section */
    add_settings_section('page_settings_section', '<div alt="f105" class="dashicons-before dashicons-admin-page">Page Options</div>', 'page_settings_section_output', 'publish_validation');

    add_settings_field('PV_title_req_page', '', 'PV_options_render_chkbx', 'publish_validation','page_settings_section',[$options,'PV_title_req_page','Require Title on Pages']);


    /** error messages */
    add_settings_section('errormsg_settings_section', '<div alt="f105" class="dashicons-before dashicons-warning">Error Message</div>', 'errormsg_settings_section_output', 'publish_validation');
    add_settings_field('PV_title_error_msg', '', 'PV_options_render_input', 'publish_validation','errormsg_settings_section',[$options,'PV_title_error_msg','Missing Title Error Msg','Title is required']);
}

add_action('admin_init', 'publish_validation_admin_init');

function post_settings_section_output() {
    echo '<p>Choose required fields for posts</p>';
}
function page_settings_section_output() {
    echo '<p>Choose required fields for pages</p>';
}
function errormsg_settings_section_output() {
    echo '<p>Provide error messages</p>';
}
function PV_options_render_chkbx($args) {
    $checked = isset($args[0][$args[1]]) ? 'checked' : '';

    echo "<input type='checkbox' id='$args[1]' name='PV_options[$args[1]]' $checked >";
    echo "<label for='$args[1]'>$args[2]</label>";
}
function PV_options_render_input($args) {
    $errormsg = isset($args[0][$args[1]]) ? $args[0][$args[1]] : $args[3];
    echo "<label for='$args[1]'>$args[2]</label>";
    echo "<p><input type='text' size='40' id='$args[1]' name='PV_options[$args[1]]' value='$errormsg' ></p>";
}
function plugin_options_validate($input) {
    //validate and sanitize input for error msgs here
    return $input;
}
?>
