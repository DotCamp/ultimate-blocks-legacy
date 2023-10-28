<?php

namespace Ultimate_Blocks\includes;


/**
 * Check is spacing value is presets or custom
 *
 * @param string $value - spacing value.
 */
function spacing_preset( $value ) {

     if ( ! $value || ! is_string( $value ) ) {
          return false;
     }
     return '0' === $value || strpos( $value, 'var:preset|spacing|' ) === 0;
}
/**
 * Return the spacing variable
 *
 * @param string $value - spacing value.
 */
function spacing_preset_css_var( $value ) {
     if ( ! $value ) {
          return null;
     }

     $matches = array();
     preg_match( '/var:preset\|spacing\|(.+)/', $value, $matches );

     if ( empty( $matches ) ) {
          return $value;
     }
     return "var(--wp--preset--spacing--{$matches[1]})";
}
/**
 * Get the spacing css
 *
 * @param array $object - spacing object.
 */
function get_spacing_css( $object ) {
     $css = array();

     foreach ( $object as $key => $value ) {
          if ( spacing_preset( $value ) ) {
               $css[ $key ] = spacing_preset_css_var( $value );
          } else {
               $css[ $key ] = $value;
          }
     }

     return $css;
}

     /**
      * Check value is undefined
      *
      * @param string $value - value.
      */
function is_undefined( $value ) {
          return null === $value || ! isset( $value ) || empty( $value );
     }

/**
 * Generate the css if value is not empty
 *
 * @param object $styles - spacing value.
 */
function generate_css_string( $styles ) {
     $css_string = '';

     foreach ( $styles as $key => $value ) {
          if ( ! is_undefined( $value ) && false !== $value && trim( $value ) !== '' && trim( $value ) !== 'undefined undefined undefined' && ! empty( $value ) ) {
               $css_string .= $key . ': ' . $value . '; ';
          }
     }

     return $css_string;
}
