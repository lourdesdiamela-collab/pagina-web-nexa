<?php
/**
 * Nexa Premium Theme Functions
 */

if ( ! function_exists( 'nexa_premium_setup' ) ) :
    function nexa_premium_setup() {
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support('custom-logo');
        register_nav_menus([
            'menu-1' => esc_html__( 'Primary', 'nexa-premium' ),
        ]);
    }
endif;
add_action( 'after_setup_theme', 'nexa_premium_setup' );

function nexa_premium_scripts() {
    // Fonts
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap', array(), null );
    
    // Main Stylesheet
    wp_enqueue_style( 'nexa-premium-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version') );

    // GSAP & ScrollTrigger for Animations (Replicating Framer Motion)
    wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), null, true );
    
    // Lucide Icons
    wp_enqueue_script( 'lucide', 'https://unpkg.com/lucide@latest', array(), null, true );

    // Main JS File
    wp_enqueue_script( 'nexa-premium-main', get_template_directory_uri() . '/assets/js/main.js', array('gsap', 'gsap-scrolltrigger', 'lucide'), wp_get_theme()->get('Version'), true );
}
add_action( 'wp_enqueue_scripts', 'nexa_premium_scripts' );
