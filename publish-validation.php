<?php
/**
 * Plugin Name: Publish Validation
 * Description: A plugin to enforce required fields on posts and pages
 * Author: Theresa Newman
 * Author URI: https://github.com/theresaweb
 * License: GPLv2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: publish-validation
 *
 * @package publishValidation
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}
require_once(plugin_dir_path( __FILE__ ) . "options.php");

register_activation_hook( __FILE__, "PV_activated");
function PV_activated()
{

}

register_deactivation_hook(__FILE__, 'PV_deactivated');
function PV_deactivated()
{
	delete_option( 'PV_options' );
}

function publish_validation_register( ) {
	wp_register_script( 'publish-validation-js', plugins_url( 'js/publish-validation.js', __FILE__ ), array ( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), 1.0, false );
	function publish_validation_script_enqueue() {
		$PV_options = get_option('PV_options');
		wp_localize_script( 'publish-validation-js', 'PV_options', $PV_options);
		wp_enqueue_script( 'publish-validation-js' );
	}
	add_action( 'enqueue_block_editor_assets', 'publish_validation_script_enqueue' );
}
add_action( 'init', 'publish_validation_register' );
