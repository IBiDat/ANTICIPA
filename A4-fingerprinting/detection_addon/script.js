(function() {
    Object.defineProperty(document.fonts,"check", {
        value: function () { return true; },
    });
    Object.defineProperty(navigator,"hardwareConcurrency", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"deviceMemory", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"languages", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"language", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(CSSStyleDeclaration.prototype,"fontFamily", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
        value: function () {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var randomString = "";
            for (let i = 0; i < 100; i++) {
                let randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
            }
            return "data:image/png;base64," + randomString;
        },
    });
    Object.defineProperty(navigator,"mediaDevices", {
        value: { enumerateDevices: () => Promise.resolve({}) }
    });
    Object.defineProperty(navigator,"permissions", {
        value: { query: () => Promise.resolve({}) }
    });
    Object.defineProperty(navigator,"storage", {
        value: { estimate: () => Promise.resolve({}) }
    });
    Object.defineProperty(navigator,"webkitTemporaryStorage", {
        value: { queryUsageAndQuota: () => Promise.resolve({}) }
    });
    Object.defineProperty(navigator,"bluetooth", {
        value: { getAvailability: () => Promise.resolve({}) }
    });
    Object.defineProperty(navigator,"vendorSub", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"productSub", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"appCodeName", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"product", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"onLine", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"webdriver", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"userActivation", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"connection", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"managed", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"virtualKeyboard", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"wakeLock", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"ink", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"hid", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"locks", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"mediaSession", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"presentation", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"serial", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"gpu", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"usb", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"windowControlsOverlay", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"xr", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"scheduling", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"geolocation", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"getGamepads", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"clipboard", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"credentials", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    Object.defineProperty(navigator,"keyboard", {
        get: function () { return undefined; },
        set: function (a) {}
    });
    WebGLRenderingContext.prototype.getExtension = function() {
        return undefined;
    };
    (function() {
        const originalGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
        WebGLRenderingContext.prototype.getSupportedExtensions = function() {
            const extensionList = originalGetSupportedExtensions.apply(this, arguments);
            
            if (Array.isArray(extensionList)) {
                return ['OES_texture_float','OES_texture_half_float','WEBGL_lose_context','OES_standard_derivatives','OES_vertex_array_object','WEBGL_debug_renderer_info','WEBGL_debug_shaders','WEBGL_compressed_texture_s3tc','WEBGL_depth_texture','OES_element_index_uint','EXT_texture_filter_anisotropic','EXT_frag_depth','WEBGL_draw_buffers','ANGLE_instanced_arrays','OES_texture_float_linear','OES_texture_half_float_linear','EXT_blend_minmax','EXT_shader_texture_lod','WEBGL_compressed_texture_pvrtc','EXT_color_buffer_half_float','WEBGL_color_buffer_float','EXT_sRGB','WEBGL_compressed_texture_etc1','EXT_disjoint_timer_query','OES_fbo_render_mipmap','WEBGL_compressed_texture_etc','WEBGL_compressed_texture_astc','EXT_color_buffer_float','WEBGL_compressed_texture_s3tc_srgb','EXT_disjoint_timer_query_webgl2','EXT_float_blend','OVR_multiview2','KHR_parallel_shader_compile','EXT_texture_compression_bptc','EXT_texture_compression_rgtc','WEBGL_multi_draw','EXT_texture_norm16','OES_draw_buffers_indexed','WEBGL_provoking_vertex','WEBGL_blend_equation_advanced_coherent','WEBGL_clip_cull_distance','WEBGL_draw_instanced_base_vertex_base_instance','WEBGL_multi_draw_instanced_base_vertex_base_instance','WEBGL_shader_pixel_local_storage','EXT_polygon_offset_clamp'];
            }
                    
            return extensionList;
        };
    })();
    
    (function() {
        const webglConstants = [
            WebGLRenderingContext.prototype.RENDERER,
            WebGLRenderingContext.prototype.VENDOR,
            WebGLRenderingContext.prototype.SHADING_LANGUAGE_VERSION,
            WebGLRenderingContext.prototype.VERSION,
            WebGLRenderingContext.prototype.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
            WebGLRenderingContext.prototype.MAX_CUBE_MAP_TEXTURE_SIZE,
            WebGLRenderingContext.prototype.MAX_FRAGMENT_UNIFORM_VECTORS,
            WebGLRenderingContext.prototype.MAX_RENDERBUFFER_SIZE,
            WebGLRenderingContext.prototype.MAX_VARYING_VECTORS,
            WebGLRenderingContext.prototype.MAX_VERTEX_ATTRIBS,
            WebGLRenderingContext.prototype.MAX_VERTEX_UNIFORM_VECTORS,
            WebGLRenderingContext.prototype.SAMPLES,
            WebGLRenderingContext.prototype.STENCIL_VALUE_MASK,
            WebGLRenderingContext.prototype.SUBPIXEL_BITS,
        ];
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(type) {
            if (webglConstants.includes(type) || webglConstants.some(c => c.toString() === type.toString())) {
                return undefined;
            } else {
                return originalGetParameter.apply(this, arguments);
            }
        };
    })();
    
    (function() {
        const originalGetContextAttributes = WebGLRenderingContext.prototype.getContextAttributes;
        WebGLRenderingContext.prototype.getContextAttributes = function() {
            const attributes = originalGetContextAttributes.apply(this, arguments);
            attributes.powerPreference = undefined;
            return attributes;
        };
    })();
    
    (function() {
        const originalGetShaderPrecisionFormat = WebGLRenderingContext.prototype.getShaderPrecisionFormat;
        WebGLRenderingContext.prototype.getShaderPrecisionFormat = function(shaderType, precisionType) {
            const format = originalGetShaderPrecisionFormat.apply(this, arguments);
            if (precisionType === this.HIGH_INT) {
                const modifiedFormat = Object.assign({}, format, {
                    rangeMax: undefined
                });
                return modifiedFormat;
            }
            return format;
        };
    })();
    
    WebGL2RenderingContext.prototype.getExtension = function() {
        return undefined;
    };
    (function() {
        const originalGetSupportedExtensions = WebGL2RenderingContext.prototype.getSupportedExtensions;
        WebGL2RenderingContext.prototype.getSupportedExtensions = function() {
            const extensionList = originalGetSupportedExtensions.apply(this, arguments);

            if (Array.isArray(extensionList)) {
                return ['OES_texture_float','OES_texture_half_float','WEBGL_lose_context','OES_standard_derivatives','OES_vertex_array_object','WEBGL_debug_renderer_info','WEBGL_debug_shaders','WEBGL_compressed_texture_s3tc','WEBGL_depth_texture','OES_element_index_uint','EXT_texture_filter_anisotropic','EXT_frag_depth','WEBGL_draw_buffers','ANGLE_instanced_arrays','OES_texture_float_linear','OES_texture_half_float_linear','EXT_blend_minmax','EXT_shader_texture_lod','WEBGL_compressed_texture_pvrtc','EXT_color_buffer_half_float','WEBGL_color_buffer_float','EXT_sRGB','WEBGL_compressed_texture_etc1','EXT_disjoint_timer_query','OES_fbo_render_mipmap','WEBGL_compressed_texture_etc','WEBGL_compressed_texture_astc','EXT_color_buffer_float','WEBGL_compressed_texture_s3tc_srgb','EXT_disjoint_timer_query_webgl2','EXT_float_blend','OVR_multiview2','KHR_parallel_shader_compile','EXT_texture_compression_bptc','EXT_texture_compression_rgtc','WEBGL_multi_draw','EXT_texture_norm16','OES_draw_buffers_indexed','WEBGL_provoking_vertex','WEBGL_blend_equation_advanced_coherent','WEBGL_clip_cull_distance','WEBGL_draw_instanced_base_vertex_base_instance','WEBGL_multi_draw_instanced_base_vertex_base_instance','WEBGL_shader_pixel_local_storage','EXT_polygon_offset_clamp'];
            }

            return extensionList;
        };
    })();
    
    (function() {
        const webglConstants = [
            WebGL2RenderingContext.prototype.RENDERER,
            WebGL2RenderingContext.prototype.VENDOR,
            WebGL2RenderingContext.prototype.SHADING_LANGUAGE_VERSION,
            WebGL2RenderingContext.prototype.VERSION,
            WebGL2RenderingContext.prototype.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
            WebGL2RenderingContext.prototype.MAX_CUBE_MAP_TEXTURE_SIZE,
            WebGL2RenderingContext.prototype.MAX_FRAGMENT_UNIFORM_VECTORS,
            WebGL2RenderingContext.prototype.MAX_RENDERBUFFER_SIZE,
            WebGL2RenderingContext.prototype.MAX_VARYING_VECTORS,
            WebGL2RenderingContext.prototype.MAX_VERTEX_ATTRIBS,
            WebGL2RenderingContext.prototype.MAX_VERTEX_UNIFORM_VECTORS,
            WebGL2RenderingContext.prototype.SAMPLES,
            WebGL2RenderingContext.prototype.STENCIL_VALUE_MASK,
            WebGL2RenderingContext.prototype.SUBPIXEL_BITS,
        ];
        const originalGetParameter = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(type) {
            if (webglConstants.includes(type) || webglConstants.some(c => c.toString() === type.toString())) {
                return undefined;
            } else {
                return originalGetParameter.apply(this, arguments);
            }
        };
    })();
    
    (function() {
        const originalGetContextAttributes = WebGL2RenderingContext.prototype.getContextAttributes;
        WebGL2RenderingContext.prototype.getContextAttributes = function() {
            const attributes = originalGetContextAttributes.apply(this, arguments);
            attributes.powerPreference = undefined;
            return attributes;
        };
    })();
    
    (function() {
        const originalGetShaderPrecisionFormat = WebGL2RenderingContext.prototype.getShaderPrecisionFormat;
        WebGL2RenderingContext.prototype.getShaderPrecisionFormat = function(shaderType, precisionType) {
            const format = originalGetShaderPrecisionFormat.apply(this, arguments);
            if (precisionType === this.HIGH_INT) {
                const modifiedFormat = Object.assign({}, format, {
                    rangeMax: undefined
                });
                return modifiedFormat;
            }
            return format;
        };
    })();
    
})();