
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
        const missingThumbnailMsg = PV_options.PV_featured_img_error_msg;
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
        let categories = wp.data.select('core/editor').getEditedPostAttribute('categories');
        let excerpt = wp.data.select('core/editor').getEditedPostAttribute('excerpt');

        let count = 0;
        const notices = ['LOCK_NOTICE_TITLE','LOCK_NOTICE_CATEGORY','LOCK_NOTICE_EXCERPT','LOCK_NOTICE_FEATIMG','LOCK_NOTICE_TAG'];
        //Hide messages on load of new post
        notices.forEach(function(notice) {
            wp.data.dispatch( 'core/notices' ).removeNotice( notice );
            console.log("notice "+notice);
        })

        wp.data.subscribe( function() {
            console.log("title--------------- "+title);
            let postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
            let postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );

            if ((postStatus === 'draft' && postType === 'post' && !postDraftShouldHonorRequiredFields) || (postStatus === 'draft' && postType === 'page' && !pageDraftShouldHonorRequiredFields) || (postType === 'post' && !postsHaveRequiredFields) || (postType === 'page' && !pagesHaveRequiredFields)) {
                // don't bother in these cases
                console.log("don't bother");
            } else {
                //title
                const checkTitle = postTitleIsRequired || titleIsReqOnPage;
                let newTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
                var titleChanged = newTitle !== title;
                title = newTitle;
                if (checkTitle && titleChanged) {
                    showHideNotification(title, 'LOCK_NOTICE_TITLE', PV_options.PV_title_error_msg);
                }
                //category
        /*         const checkCats = postCatIsRequired;
                if (categories) { console.log("categories[0] "+categories[0]); }
                let newCats = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'categories' );
                if (newCats) { console.log("newCats[0] "+newCats[0]); }
                var catsChanged = !(_.isEqual(newCats, categories));
                //var catsChanged = JSON.stringify(newCats) !== JSON.stringify(categories);
                console.log("catsChanged "+catsChanged);
                console.log("checkCats "+checkCats);
                categories = newCats;
                if (categories) { console.log("changedcategories[0] "+categories[0]); }
                if (checkCats && catsChanged) {
                    console.log("cats----------------------------here");
                    showHideNotification(categories, 'LOCK_NOTICE_CATEGORY', PV_options.PV_category_error_msg);
                } */
                //excerpt
                const checkExcerpt = postExcerptIsRequired;
                let newExcerpt = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'excerpt' );
                let excerptChanged = newExcerpt !== excerpt;
                excerpt = newExcerpt;
                if (checkExcerpt && excerptChanged) {
                    showHideNotification(excerpt, 'LOCK_NOTICE_EXCERPT', PV_options.PV_excerpt_error_msg);
                }         
            }
            console.log('tick'+count);
            count ++;
        });




      }, 500);
});