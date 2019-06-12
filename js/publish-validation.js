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
const postsHaveRequiredFields = postTagIsRequired || postCatIsRequired || postExcerptIsRequired || postFeaturedImgIsRequired || postTagIsRequired;
const pagesHaveRequiredFields = featuredImgIsReqOnPage || titleIsReqOnPage;
const postDraftShouldHonorRequiredFields = PV_options.PV_for_post_draft==='on' ? true : false;
const pageDraftShouldHonorRequiredFields = PV_options.PV_for_page_draft==='on' ? true : false;
console.log(PV_options);
const postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
console.log("post type is "+postType);
var postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );
console.log("poststatus is "+postStatus);

if ((postStatus === 'draft' && postType === 'post' && !postDraftShouldHonorRequiredFields) || (postStatus === 'draft' && postType === 'page' && !pageDraftShouldHonorRequiredFields) || (postType === 'post' && !postsHaveRequiredFields) || (postType === 'page' && !pagesHaveRequiredFields)) {
    // don't bother in these cases
} else {
    var count = 0;
    var checkTitle = postTitleIsRequired || titleIsReqOnPage;
    var title = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
    var categories = wp.data.select('core/editor').getEditedPostAttribute('categories');
    var excerpt = wp.data.select('core/editor').getEditedPostAttribute('excerpt');
    lockPost();
    //also featured imnage
    wp.data.subscribe( function() {
        if (checkTitle) {
            checkForTitle();
        }
        console.log('tick'+count);
        count ++;
    });
}
function checkForTitle() {
    var content = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );
    var newTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
    var titleChanged = newTitle !== title;
    title = newTitle ? newTitle : '';
    console.log("titlechnged "+titleChanged);
    if ( titleChanged ) {
        if (newTitle === '') {
            lockPost();
            wp.data.dispatch( 'core/notices' ).createErrorNotice( PV_options.PV_title_error_msg, { id: 'LOCK_NOTICE_TITLE',isDismissible: true} );
        } else {
            unlockPost();
            wp.data.dispatch( 'core/notices' ).removeNotice('LOCK_NOTICE_TITLE');
            console.log("title is set");
        }
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