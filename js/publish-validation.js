function showHideNotification(param, notificationId, errormsg) {
    if (param === '') {
        lockPost();
        wp.data.dispatch( 'core/notices' ).createErrorNotice( errormsg, { id: notificationId,isDismissible: true} );
        return;
    } else {
        unlockPost();
        wp.data.dispatch( 'core/notices' ).removeNotice(notificationId);
        console.log("param is set");
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
document.addEventListener( 'DOMContentLoaded', function () {
    console.log("content loaded");
    console.log(PV_options);
    window.setTimeout(function() {
        console.log("after 500 ");
        console.log(PV_options);

        //Error Messages
        const missingCategoryMsg = PV_options.PV_category_error_msg;
        const missingExcerptMsg = PV_options.PV_excerpt_error_msg;
        const missingThumbnailMsg = PV_options.PV_featured_image_error_msg;
        const missingTagMsg = PV_options.PV_tag_error_msg;
        const missingTitleMsg = PV_options.PV_title_error_msg;
        //Required fields
        const postTitleIsRequired = PV_options.PV_title_req_post==='on' ? true : false;
        const postCatIsRequired = PV_options.PV_category_req_post==='on' ? true : false;
        const postExcerptIsRequired = PV_options.PV_excerpt_req_post==='on' ? true : false;
        const postFeaturedImgIsRequired = PV_options.PV_featured_image_req_post==='on' ? true : false;
        const postTagIsRequired = PV_options.PV_tag_req_post==='on' ? true : false;
        const featuredImgIsReqOnPage = PV_options.PV_featured_img_req_page==='on' ? true : false;
        const titleIsReqOnPage = PV_options.PV_title_req_page==='on' ? true : false;

        //PV_options passed from plugin php
        const postsHaveRequiredFields = postTitleIsRequired || postCatIsRequired || postExcerptIsRequired || postFeaturedImgIsRequired || postTagIsRequired;
        const pagesHaveRequiredFields = featuredImgIsReqOnPage || titleIsReqOnPage;
        const postDraftShouldHonorRequiredFields = PV_options.PV_for_post_draft==='on' ? true : false;
        const pageDraftShouldHonorRequiredFields = PV_options.PV_for_page_draft==='on' ? true : false;

        let title = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
        let content = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );
        let featuredImage = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );

        let categoriesLength = Object.keys(wp.data.select('core/editor').getEditedPostAttribute('categories')).length;
        let tagsLength = Object.keys(wp.data.select('core/editor').getEditedPostAttribute('tags')).length;
        let excerpt = wp.data.select('core/editor').getEditedPostAttribute('excerpt');

        let count = 0;

        let postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
        if ((postType === 'post' && postsHaveRequiredFields) || (postType === 'page' && pagesHaveRequiredFields)) {
            wp.data.subscribe( function() {
                
                let postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );
    
                if ((postStatus === 'draft' && postType === 'post' && !postDraftShouldHonorRequiredFields) || (postStatus === 'draft' && postType === 'page' && !pageDraftShouldHonorRequiredFields)) {
                    // don't bother in these cases
                    console.log("don't bother");
                } else {
                    //override post locking system that allows content without title
                    const checkContent = true;
                    let newContent = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );
                    var contentChanged = newContent !== content;
                    content = newContent;
                    if (contentChanged && title === '') {
                        showHideNotification(title, 'LOCK_NOTICE_TITLE', missingTitleMsg);
                    }
                    //title
                    const checkTitle = postTitleIsRequired || titleIsReqOnPage;
                    let newTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
                    var titleChanged = newTitle !== title;
                    title = newTitle;
                    if (checkTitle && titleChanged) {
                        showHideNotification(title, 'LOCK_NOTICE_TITLE', missingTitleMsg);
                    }
                    //featured image
                    const checkFeaturedImage = postFeaturedImgIsRequired || featuredImgIsReqOnPage;
                    let newFeaturedImage = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );
                    var featuredImageChanged = newFeaturedImage !== featuredImage;
                    featuredImage = newFeaturedImage;
                    if (checkFeaturedImage && featuredImageChanged) {
                        showHideNotification(featuredImage === 0 ? '' : featuredImage, 'LOCK_NOTICE_FEATURED_IMAGE', missingThumbnailMsg);
                    }
                    if (postType === 'post') {
                        //excerpt
                        const checkExcerpt = postExcerptIsRequired;
                        let newExcerpt = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'excerpt' );
                        let excerptChanged = newExcerpt !== excerpt;
                        excerpt = newExcerpt;
                        if (checkExcerpt && excerptChanged) {
                            showHideNotification(excerpt, 'LOCK_NOTICE_EXCERPT', missingExcerptMsg);
                        }
                        //category
                        const checkCategory = postCatIsRequired;
                        let newCategoriesLength = Object.keys(wp.data.select('core/editor').getEditedPostAttribute('categories')).length;
                        let categoryChanged = newCategoriesLength !== categoriesLength;
                        categoriesLength = newCategoriesLength;
                        if (checkCategory && categoryChanged) {
                            showHideNotification(categoriesLength === 0 ? '' : categoriesLength, 'LOCK_NOTICE_CATEGORY', missingCategoryMsg);
                        }
                        //tag
                        const checkTags = postTagIsRequired;
                        let newTagsLength = Object.keys(wp.data.select('core/editor').getEditedPostAttribute('tags')).length;
                        let tagsChanged = newTagsLength !== tagsLength;
                        tagsLength = newTagsLength;
                        if (checkTags && tagsChanged) {
                            showHideNotification(tagsLength === 0 ? '' : tagsLength, 'LOCK_NOTICE_TAGS', missingTagMsg);
                        }
                    }
                }
                console.log('tick'+count);
                count ++;
            });
        }

      }, 500);
});