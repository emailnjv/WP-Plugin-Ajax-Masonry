<?php
/*
Plugin Name:       Ajax Image Mason Grid
Plugin URI:        http://example.com/plugin-name-uri/
Description:       Plugin made by nick for limelight.
Version:           1.0.0
Author:            Nick Vincent
Author URI:        http://example.com/
License:           GPL-2.0+
License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
*/






function sl9_img_flex_loader_shortcode($atts, $content = null) {
	$atts = shortcode_atts( array(
		'slug'		=> null
	), $atts
	);

	//get site url
	//concatenate to slug
	$site_link = parse_url(home_url(), PHP_URL_HOST);
	$vc_raw_js_shortcode_base_64 = '<script>ajaxImageLoader("' . $atts['slug'] . '");</script>';
	$vc_raw_js_shortcode_base_64_encode = base64_encode($vc_raw_js_shortcode_base_64);
	$vc_raw_js_shortcode = '[vc_column][vc_raw_js]' . $vc_raw_js_shortcode_base_64_encode . '[/vc_raw_js][/vc_column]';



	$ajax_query = do_shortcode($vc_raw_js_shortcode, false);

	//parse the url for host and path
	$img_loader = '[vc_column_text]<div class="grid">
						    <div class="grid-sizer">
							    </div>
								</div>
							<div class=ajax-loader-div>
						    <i class="ajax-img-loader icon-arrows-cw"></i>
						</div>[/vc_column_text]';
	$img_loader .= do_shortcode($ajax_query);

	return do_shortcode($img_loader);
}
add_shortcode('img_flex_loader', 'sl9_img_flex_loader_shortcode');



function sb_instagram_scripts_enqueue() {
	//Register the script to make it available
	wp_register_script( 'add_img_loaded_script', plugins_url( '/js/imagesloaded.min.js' , __FILE__ ), array('jquery'), null, true ); //http://www.minifier.org/
	wp_register_script( 'add_masonry_script', plugins_url( '/js/masonry.min.js' , __FILE__ ), array('jquery'), null, true ); //http://www.minifier.org/

	//Options to pass to JS file
	wp_enqueue_script( 'add_img_loaded_script' );
	wp_enqueue_script( 'add_masonry_script' );

}
//Enqueue scripts
add_action( 'wp_enqueue_scripts', 'sl9_img_flex_loader_scripts_enqueue' );