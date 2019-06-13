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
console.log(PV_options);
let title = String(wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' ));
let categories = String(wp.data.select('core/editor').getEditedPostAttribute('categories'));
let excerpt = String(wp.data.select('core/editor').getEditedPostAttribute('excerpt'));
console.log(typeof(excerpt));
console.log("excerpt "+excerpt);
let count = 0;
wp.data.subscribe( function() {
    let postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
    let postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );

    if ((postStatus === 'draft' && postType === 'post' && !postDraftShouldHonorRequiredFields) || (postStatus === 'draft' && postType === 'page' && !pageDraftShouldHonorRequiredFields) || (postType === 'post' && !postsHaveRequiredFields) || (postType === 'page' && !pagesHaveRequiredFields)) {
        // don't bother in these cases
        console.log("don't bother");
    } else {
        //title
        const checkTitle = postTitleIsRequired || titleIsReqOnPage;
        let newTitle = String(wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' ));
        var titleChanged = newTitle !== title;
        title = newTitle;
        if (checkTitle && titleChanged) {
            showHideNotification(title, 'LOCK_NOTICE_TITLE', PV_options.PV_title_error_msg);
        }
        //category
        const checkCats = postCatIsRequired;
        let newCats = String(wp.data.select( 'core/editor' ).getEditedPostAttribute( 'categories' ));
        console.log("newCats"+newCats);
        var catsChanged = newCats !== categories;
        console.log("catsChanged "+catsChanged);
        console.log("checkCats "+checkCats);
        categories = newCats;
        if (checkCats && catsChanged) {
            console.log("cats----------------------------here");
            showHideNotification(categories, 'LOCK_NOTICE_CATEGORY', PV_options.PV_category_error_msg);
        }        
        //excerpt
        const checkExcerpt = postExcerptIsRequired;
        let newExcerpt = String(wp.data.select( 'core/editor' ).getEditedPostAttribute( 'excerpt' ));
        console.log("newExcerpt"+newExcerpt);
        let excerptChanged = newExcerpt !== excerpt;
        console.log("excerptChanged "+excerptChanged);
        console.log("chekckexcerpt "+checkExcerpt);
        excerpt = newExcerpt;
        if (checkExcerpt && excerptChanged) {
            console.log("----------------------------here");
            showHideNotification(excerpt, 'LOCK_NOTICE_EXCERPT', PV_options.PV_excerpt_error_msg);
        }         
    }
    console.log('tick'+count);
    count ++;
});
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