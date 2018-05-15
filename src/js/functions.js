`use strict`;
import $ from 'jquery'

export default class Functions {
    random(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }; //RANDOM

    isSessionToken(){
        let cookies = document.cookie.split(`; `);
        let sessionToken;
        for(let i = 0; i < cookies.length; i++) {
            if(cookies[i].indexOf(`session-token`) !== -1) {
                sessionToken = cookies[i].split(`=`)[1];
                break;
            };
        };

        return sessionToken;
    }; // IS SESSION TOKEN 

    showMessage(errorSuccsessClassName, fieldSelector, message){
        $(fieldSelector).parent().prev(`.${errorSuccsessClassName}`).remove();
        $(fieldSelector).parent().before(`<div class="${errorSuccsessClassName}">${message}</div>`);
    };//SHOW MESSAGE

    messageDelete(errorSuccsessClassName, fieldSelector){
        $(fieldSelector).parent().prev(`.${errorSuccsessClassName}`).remove();
    };//MESSAGE DELETE

    showModal(modalClassName, containerSelector, message){
        $(containerSelector).append(`<div class="modalOverlay"></div>
                                    <div class="${modalClassName}">${message}</div>`);
    }; //SHOW MODAL

    deleteModal(modalClassName){
        $(`.modalOverlay`).remove();
        $(`.${modalClassName}`).remove();
    };//DELETE MODAL

    capsDetection(e, fieldSelector){
        const functions = new Functions,
            character = e.keyCode ? e.keyCode : e.which,
            sftKey = e.shiftKey ? e.shiftKey : ((character == 16) ? true : false),
            isCapsLock = (((character >= 65 && character <= 90) && !sftKey) || ((character >= 97 && character <= 122) && sftKey));

        if (isCapsLock) {
            functions.showMessage(`inputError`, fieldSelector, `CAPS LOCK is on!`);
        } else{
            functions.messageDelete(`inputError`, fieldSelector);
        };
    }; //CAPS DETECTION

    getUserIdAndName(buttonSelector) {
        let userInfo = {
            userId: $(buttonSelector).parent().prev().children(`a`).data(`id`),
            userName: $(buttonSelector).parent().prev().children(`a`).html()
        };
        if(!userInfo.userId) {
            let userInfo = {
                userId: $(buttonSelector).closest(`div`).prev().data(`id`),
                userName: $(buttonSelector).closest(`div`).prev().html()
            };
            return(userInfo);
        };
        return(userInfo);
    }; //GET USER ID AND NAME

    showCommentBlock(linkSelector){
        $(linkSelector).parent().before(`
        <div class="input-wrapper">
            <input class="comment-input" name="postText" type="text" placeholder="Comment">
            <button class="comment-btn" name="commentPost">
                <i class="fa fa-comment" aria-hidden="true"></i>
            </button>
        </div>`);
        $(linkSelector).attr(`name`, `removeCommentBlock`).text(`Hide comment field`);
    };//SHOW COMMENT BLOCK

    removeCommentBlock(linkSelector) {
        $(linkSelector).parent().prev().remove();
        $(linkSelector).attr(`name`, `showCommentBlock`).text(`Comment`);
    };//REMOVE COMMENT BLOCK
};

