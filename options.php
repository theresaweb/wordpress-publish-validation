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
/*
$post_options
PV_for_post_enabled'
    PV_title_req_post
	PV_excerpt_req_post
	PV_category_req_post
	PV_tag_req_post
	PV_featured_image_req_post

                

 		'PV_for_page_enabled'					=> '',
		'PV_for_draft_enabled' 				=> '',
		'PV_featured_img_req_page' 		=> '',
		'PV_title_req_page' 					=> '',

		'PV_title_error_msg' 					=> 'Title is required',
		'PV_excerpt_error_msg' 				=> 'Excerpt is required',
		'PV_category_error_msg' 			=> 'Categories are required',
		'PV_tag_error_msg' 						=> 'Please set less one tag',
        'PV_featured_img_error_msg' 	=> 'Post Thumbnail is required'
        */
function publish_validation_admin_init(){
    $options = get_option('PV_options');
    register_setting( 'publish_validation_options', 'PV_options', 'plugin_options_validate' );
    /** post section */
    add_settings_section('post_settings_section', '<div alt="f109" class="dashicons-before dashicons-admin-post">Post Options</div>', 'post_settings_section_output', 'publish_validation');
/*     add_settings_field('PV_for_post_enabled', '<div alt="f109" class="dashicons-before dashicons-admin-post">Required Fields on Posts</div>', 'PV_for_post_chkbx', 'publish_validation','post_settings_section',$options); */
    add_settings_field('PV_for_post_draft', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_for_post_draft','Require Validation on Post Drafts']);
    add_settings_field('PV_title_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_title_req_post','Require Title on Posts']);
    add_settings_field('PV_excerpt_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_excerpt_req_post','Require Excerpt on Posts']);
    add_settings_field('PV_category_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_category_req_post','Require Category on Posts']);
    add_settings_field('PV_tag_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_tag_req_post','Require tag on Posts']);
    add_settings_field('PV_featured_image_req_post', '', 'PV_options_render_chkbx', 'publish_validation','post_settings_section',[$options,'PV_featured_image_req_post','Require Featured Image on Posts']);

    /** page section */
    add_settings_section('page_settings_section', '<div alt="f105" class="dashicons-before dashicons-admin-page">Page Options</div>', 'page_settings_section_output', 'publish_validation');
/*     add_settings_field('PV_for_page_enabled', '<div alt="f105" class="dashicons-before dashicons-admin-page">Required Fields on Pages</div>', 'PV_for_page_chkbx', 'publish_validation','page_settings_section',$options); */
    add_settings_field('PV_for_page_draft', '', 'PV_options_render_chkbx', 'publish_validation','page_settings_section',[$options,'PV_for_page_draft','Require Validation on Page Drafts']);
    add_settings_field('PV_title_req_page', '', 'PV_options_render_chkbx', 'publish_validation','page_settings_section',[$options,'PV_title_req_page','Require Title on Pages']);
    add_settings_field('PV_featured_image_req_page', '', 'PV_options_render_chkbx', 'publish_validation','page_settings_section',[$options,'PV_featured_image_req_page','Require Featured Image on Pages']);

}

add_action('admin_init', 'publish_validation_admin_init');

function post_settings_section_output() {
    echo '<p>Choose required fields for posts</p>';
}
function page_settings_section_output() {
    echo '<p>Choose required fields for pages</p>';
}
/* function PV_for_post_chkbx($options) {
    $checked = isset($options['PV_for_post_enabled']) ? 'checked' : '';
    echo "<input type='checkbox' id='PV_for_post_enabled' name='PV_options[PV_for_post_enabled]' $checked >";
    echo "<label for='PV_for_post_enabled'>Validate for Posts</label>";
}
function PV_for_page_chkbx($options) {
    $checked = isset($options['PV_for_page_enabled']) ? 'checked' : '';
    echo "<input type='checkbox' id='PV_for_page_enabled' name='PV_options[PV_for_page_enabled]' $checked >";
    echo "<label for='PV_for_page_enabled'>Validate for Pages</label>";
} */
function PV_options_render_chkbx($args) {
    $checked = isset($args[0][$args[1]]) ? 'checked' : '';
    echo "<input type='checkbox' id='$args[1]' name='PV_options[$args[1]]' $checked >";
    echo "<label for='$args[1]'>$args[2]</label>";
}
function plugin_options_validate($input) {
    //validate input for error msgs here
    return $input;
}
?>