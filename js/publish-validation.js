(function () {
    //PV_options passed from plugin php
    var postsHaveRequiredFields = PV_options.PV_for_post_enabled ? true : false;
    var pagesHaveRequiredFields = PV_options.PV_for_page_enabled ? true : false;
    var draftShouldHonorRequiredFields = PV_options.PV_for_draft_enabled ? true : false;
    //Error Messages
    var missingCategoryMsg = PV_options.PV_category_error_msg;
    var missingExcerptMsg = PV_options.PV_excerpt_error_msg;
    var missingThumbnailMsg = PV_options.PV_featured_img_error_msg;
    var missingTagMsg = PV_options.PV_tag_error_msg;
    var missingTitleMsg = PV_options.PV_title_error_msg;
    //Required fields
    var postCatIsRequired = PV_options.PV_category_req_post ? true : false;
    var postExcerptIsRequired = PV_options.PV_excerpt_req_post ? true : false;
    var postFeaturedImgIsRequired = PV_options.PV_featured_image_req_post ? true : false;
    var featuredImgIsReqOnPage = PV_options.PV_featured_img_req_page ? true : false;
    var postTitleIsRequired = PV_options.PV_title_req_post ? true : false;
    var titleIsReqOnPage = PV_options.PV_title_req_page ? true : false;
    var postTagIsRequired = PV_options.PV_tag_req_post ? true : false;
console.log(PV_options);
    var postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
    console.log("post type is "+postType);
    var postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );
    console.log("poststatus is "+postStatus);
    function validate() {
        // what is the most efficient logic tree??
        if ((postStatus === 'draft' && !draftShouldHonorRequiredFields) || (postType === 'post' && !postsHaveRequiredFields) || (postType === 'page' && !pagesHaveRequiredFields)) {
        // don't bother in these cases
        } else {
            console.log("let's do this");
            //title
                
            //category

            //excerpt

            //tag

            //featured image
        }
    }
    validate();
})();
    var title = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
    var categories = wp.data.select("core/editor").getEditedPostAttribute("categories");
    var excerpt = wp.data.select("core/editor").getEditedPostAttribute("excerpt");
    var count = 0;
    // start subscribe
        wp.data.subscribe( function() {
        console.log("tick"+count);


    /*     var newCount = wp.data.select( 'core/editor' ).getBlockCount();
        currentCount = newCount;
        var hasNewBlocks = newCount > currentCount; */
        var newTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
        var titleChanged = newTitle !== title;
        title = newTitle;
        

        if ( titleChanged) { 
            // A new block has been added, do something
            console.log( 'The new title is :' + newTitle );
            if (newTitle === '') {
                lockPost();
                wp.data.dispatch( 'core/notices' ).createErrorNotice( PV_options.PV_title_error_msg, { id: 'LOCK_NOTICE_TITLE',isDismissible: true} ) ;
                // show message or open sidebar??
            } else {
                unlockPost();
                wp.data.dispatch( 'core/notices' ).removeNotice('LOCK_NOTICE_TITLE');
                console.log("title is set");
            }
        }
        function lockPost() {
            wp.data.dispatch( 'core/editor' ).lockPostSaving( 'editorlock' );
        }
        function unlockPost() {
            wp.data.dispatch( 'core/editor' ).unlockPostSaving( 'editorlock' );
        }
        function showError ( errorMsg, errorId ) {
            wp.data.dispatch( 'core/notices' ).createErrorNotice( errorMsg , { id: errorId,isDismissible: true} ) ;
        }
        function removeError( errorId ) {
            wp.data.dispatch( 'core/notices' ).removeNotice(errorId);
        }
        count ++;
    } );
