
function showHideNotification(param, notificationId, errormsg) {
  console.log('showHideNotification');
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
  console.log('lockPost');
    wp.data.dispatch( 'core/editor' ).lockPostSaving( 'editorlock' );
}
function unlockPost() {
  console.log('unlockPost');
    wp.data.dispatch( 'core/editor' ).unlockPostSaving( 'editorlock' );
}
function showError ( errorMsg, errorId ) {
  console.log('showError');
    wp.data.dispatch( 'core/notices' ).createErrorNotice( errorMsg , { id: errorId,isDismissible: true} ) ;
}
function removeError( errorId ) {
  console.log('removeError');
    wp.data.dispatch( 'core/notices' ).removeNotice(errorId);
}
document.addEventListener( 'DOMContentLoaded', function () {
    console.log("content loaded");
    console.log(PV_options);

        //Error Messages
        let missingTitleMsg = PV_options.PV_title_error_msg;
        //Required fields
        const postTitleIsRequired = PV_options.PV_title_req_post==='on' ? true : false;
        const titleIsReqOnPage = PV_options.PV_title_req_page==='on' ? true : false;

        //PV_options passed from plugin php
        const postsHaveRequiredFields = postTitleIsRequired;
        const pagesHaveRequiredFields = titleIsReqOnPage;
        const postDraftShouldHonorRequiredFields = PV_options.PV_for_post_draft==='on' ? true : false;
        const pageDraftShouldHonorRequiredFields = PV_options.PV_for_page_draft==='on' ? true : false;
        console.log('postDraftShouldHonorRequiredFields',postDraftShouldHonorRequiredFields);
        let title = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
        let content = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );

        let count = 0;

        let postType = wp.data.select( 'core/editor' ).getEditedPostAttribute('type');
        //if ((postType === 'post' && postsHaveRequiredFields) || (postType === 'page' && pagesHaveRequiredFields)) {
            wp.data.subscribe( function() {

                let postStatus = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'status' );
                console.log('postStatus',postStatus);
                console.log('postType',postType);
                if ((postStatus === 'draft')  && ((postType === 'post' && !postDraftShouldHonorRequiredFields) || (postType === 'page' && !pageDraftShouldHonorRequiredFields))) {
                    // don't bother in these cases
                    console.log("don't bother");
                } else {
                    //override post locking system that allows content without title
                    const checkContent = true;
                    let newContent = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );
                    var contentChanged = newContent !== content;
                    content = newContent;
                    if (contentChanged && title === '') {
                        if ((postType === 'post' && !postDraftShouldHonorRequiredFields) || (postType === 'page' && !pageDraftShouldHonorRequiredFields)) {
                            missingTitleMsg = 'Title is required except on draft';
                        }
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
                }
                console.log('tick'+count);
                count ++;
            });
        //}

});
