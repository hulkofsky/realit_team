`use strict`;

import $ from 'jquery';
import RestInterraction from './restInterraction.js';
import Validation from './validation.js';
import Functions from './functions.js';
import Render from './render.js';

(function(){
    const currentRestInterraction = new RestInterraction();
    const currentValidation = new Validation();
    const functions = new Functions();
    const render = new Render();

    currentRestInterraction.init(`.posts`, `.right`);

    $(`body`).on(`click`, `[name=loginButton]`, e => {
        e.preventDefault();
        currentRestInterraction.login(`[name="username"]`, `[name="password"]`, `[name=loginButton]`,
                                        `.footer-year`, `.posts`, `.right`);
    });//LOGIN BUTTON CLICK

    $(`body`).on(`click`, `[name=registerButton]`, () => {
        const registerFieldSelectors = {
            username: `[name="username"]`,
            email: `[name="email"]`,
            password: `[name="password"]`,
            confirmPass: `[name="confirmPass"]`,
            captcha: `[name="captcha"]`,
            firstname: `[name="firstname"]`,
            lastname: `[name="lastname"]`,
            registerButton: `[name="registerButton"]`
        };

        currentRestInterraction.registration(registerFieldSelectors);
    }); // REGISTER BUTTON CLICK

    $(`body`).on(`click`, `[name=toRegister]`, e => {
        e.preventDefault();
        render.registerPage();
    }); //REGISTER LINK CLICK

    $(`body`).on(`click`, `[name=toLogin]`, e => {
        e.preventDefault();
        currentRestInterraction.init();
    });// LOGIN LINK CLICK

    $(`body`).on(`click`, `[name=recoverPassLink]`, e => {
        e.preventDefault();
        render.recoverPassPage();
    }); //FORGOT PASSWORD LINK CLICK

    $(`body`).on(`click`, `[name=recoverPassBtn]`, e => {
        e.preventDefault();
        currentRestInterraction.sendPassRecoverRequest(`[name="email"]`, `[name=recoverPassBtn]`);
    }); //RECOVER PASSWORD BUTTON CLICK

                                                    //PROFILE HBS
    $(`body`).on(`click`, `[name="myProfile"]`, e => {
        e.preventDefault();
        currentRestInterraction.init(`.posts`, `.right`);
    }); //MY PROFILE LINK CLICK     
    
    $(`body`).on(`click`, `[name=profileSettings]`, e => {
        e.preventDefault();
        currentRestInterraction.profileSettings(`.content`);
    }); //SETTINGS LINK CLICK

    $(`body`).on(`click`, `[name="showNews"]`, e => {
        e.preventDefault();
        const newsContainer = `.wall`
        if($(`div`).is(newsContainer)) {
            currentRestInterraction.showYourNews(newsContainer);
        } else {
            const promise = new Promise((resolve, reject) => {
                currentRestInterraction.init(`.posts`, `.right`);
                resolve();
            });
            promise.then(() => {
                currentRestInterraction.showYourNews(newsContainer);
            });   
        };
        
    }); //SETTINGS LINK CLICK
    
    $(`body`).on(`click`, `[name=logout]`, e => {
        e.preventDefault();
        currentRestInterraction.logout();
    }); //LOGOUT LINK CLICK

    $(`body`).on(`keyup`, `[name="searchUserProfiles"]`, e => {
        if(e.keyCode==13)
           {
                currentRestInterraction.searchUserProfiles($(`[name="searchUserProfiles"]`).val(), `.wall`);
           };
    });//SEARCH FIELD ENTER PRESS

    $(`body`).on(`click`, `[name=addPhotoToPost]`, e => {
        e.preventDefault();
        $(`#addPhotoToPost`).trigger(`click`);
    }); //ADD PHOTO TO POST BUTTON CLICK

    $(`body`).on(`change`, `#addPhotoToPost`, e => {
        e.preventDefault();
        currentRestInterraction.addPhotoToPreview(`.post-form`, `[name="UploadForm[imageFile]"]`);
    }); //ADD PHOTO TO POST BUTTON CLICK

    $(`body`).on(`click`, `.remove-preview`, function(e) {
        e.preventDefault();
        currentRestInterraction.removePhotoFromPreview(this);
    }); //ADD PHOTO TO POST BUTTON CLICK
    

    $(`body`).on(`click`, `[name=sendPost]`, e => {
        e.preventDefault();
        currentRestInterraction.createPost($(`[name="postText"]`).val(), `.photos-preview`, `.posts`);
    }); //SEND POST BUTTON CLICK

    $(`body`).on(`click`, `[name="friendName"]`, function(e) {
        e.preventDefault();
        const userId = $(this).data(`id`);
        currentRestInterraction.showUsersProfile(userId, `.posts`, `.right`);
    }); //FRIEND NAME LINK CLICK

    $(`body`).on(`click`, `[name="userFollow"]`, function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.addFriendOrEnemy(userInfo.userId, 1, userInfo.userName, `.right`);
    }); //FOLLOW BUTTON CLICK

    $(`body`).on(`click`, `[name="userBlock"]`, function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.addFriendOrEnemy(userInfo.userId, 2, userInfo.userName, `.right`);
    }); //BLOCK BUTTON CLICK    

    $(`body`).on(`click`, `[name="viewFriends"]`, function(e){
        e.preventDefault();
        const userId = $(this).data(`id`);
        currentRestInterraction.viewFriendsOrEnemies(`.wall`, 1, userId);
    }); //View ALL CLICK(FRIENDS)

    $(`body`).on(`click`, `[name="viewEnemies"]`, function(e){
        e.preventDefault();
        const userId = $(this).data(`id`);
        currentRestInterraction.viewFriendsOrEnemies(`.wall`, 2, userId);   
    }); //View ALL CLICK(ENEMIES)

    $(`body`).on(`click`, `[name="deleteUserFromList"]`, function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.deleteUserFromList(userInfo.userId, userInfo.userName, `.right`);
    }); //DELETE USER FROM LIST CLICK
    
    $(`body`).on(`click`, `[name="showCommentBlock"]`, function(e) {
        e.preventDefault();
        functions.showCommentBlock(this);
    }); //SHOW COMMENT BLOCK LINK CLICK

    $(`body`).on(`click`, `[name="removeCommentBlock"]`, function(e) {
        e.preventDefault();
        functions.removeCommentBlock(this);
    }); //REMOVE COMMENT BLOCK LINK CLICK


    $(`body`).on(`click`, `[name="commentPost"]`, function(e) {
        e.preventDefault();
        const text = $(this).prev().val();
        const postId = $(this).parent().next().data(`id`);
        if(text) {
            currentRestInterraction.addCommentToPost(text, postId, `.posts`);
        };
    }); //COMMENT BUTTON CLICK

    $(`body`).on(`click`, `[name="deleteComment"]`, function(e) {
        e.preventDefault();
        const commentId = $(this).data(`id`);
        currentRestInterraction.removePostComment(commentId, `.posts`);
    }); //COMMENT BUTTON CLICK

    $(`body`).on(`click`, `[name="removePost"]`, function(e) {
        e.preventDefault();
        const postId = $(this).parent().data(`id`);
        currentRestInterraction.removePost(postId, `.posts`);
    }); //REMOVE POST LINK CLICK
                                                    //PROFILE HBS


                                                    //SEARCH RESULTS HBS
    $(`body`).on(`click`, `[name="backToWall"]`, e => {
        e.preventDefault();
        currentRestInterraction.init(`.posts`, `.right`);
    }); //BACK TO WALL BUTTON CLICK     
                                                    //SEARCH RESULTS HBS


                                                    //PROFILESETTINGS HBS
    $(`body`).on(`click`, `[name="updateProfile"]`, e => {
        e.preventDefault();
        let updateInfoFields = {
                                firstname: $(`[name="firstname"]`).val(),
                                lastname: $(`[name="lastname"]`).val(),
                                quote: $(`[name="quote"]`).val(),
                                lived: $(`[name="lived"]`).val(),
                                from: $(`[name="from"]`).val(),
                                went: $(`[name="went"]`).val(),
                                buttonSelector: `[name="updateProfile"]`
                            }; 
        currentRestInterraction.uploadPhoto(`[name="UploadForm[imageFile]"]`).then(photoURL => {
            updateInfoFields.photo = photoURL;
            currentRestInterraction.updateProfileInfo(updateInfoFields);
            setTimeout(() => {
                currentRestInterraction.profileSettings(`.content`);
            }, 2000);
        },
        () => {
            currentRestInterraction.updateProfileInfo(updateInfoFields);
            setTimeout(() => {
                currentRestInterraction.profileSettings(`.content`);
            }, 2000);
        });
        
    }); //UPDATE PROFILE BUTTON CLICK

    $(`body`).on(`click`, `[name="removeProfile"]`, e => {
        e.preventDefault();
        currentRestInterraction.removeProfile();
    });// REMOVE PROFILE LINK CLICK

    $(`body`).on(`click`, `[name="albumList"]`, e => {
        e.preventDefault();
        currentRestInterraction.getAlbums(`[name="albumsContainer"]`);
    });

    $(`body`).on(`click`, `[name="createAlbum"]`, e => {
        e.preventDefault();
        const albumName = $(`[name="albumName"]`).val();
        currentRestInterraction.createAlbum(albumName);
    });//CREATE ALBUM BUTTON CLICK

    $(`body`).on(`click`, `[name="albumOpen"]`, function(e) {
        e.preventDefault();
        const albumId = $(this).parent().data(`id`);
        currentRestInterraction.openAlbum(albumId, `[name="albumsContainer"]`);
    });//ALBUM OPEN BUTTON CLICK
    
    $(`body`).on(`click`, `[name="addPhotoToAlbum"]`, e => {
        e.preventDefault();
        $(`#addPhotoToAlbum`).trigger(`click`);
    });//ADD PHOTO TO ALBUM BUTTON CLICK

    $(`body`).on(`click`, `[name="albumDelete"]`, function(e) {
        e.preventDefault();
        const albumId = $(this).parent().data(`id`);
        currentRestInterraction.deleteAlbum(albumId, `[name="albumsContainer"]`);
    });//DELETE ALBUM LINK CLICK

    $(`body`).on(`click`, `[name="photoSmall"]`, function() {
        const photoURL = $(this).children(`img`).attr(`src`);
        functions.showModal(`photoModal`, `.wrapper`, `<img src="${photoURL}" alt="photo-big">`);
    });//PHOTO SMALL DIV CLICK

    $(`body`).on(`click`, `.modalOverlay`, function(e) {
        e.stopPropagation();
        functions.deleteModal(`photoModal`);
    });//MODAL OVERLAY CLICK
    
    $(`body`).on(`change`, `#addPhotoToAlbum`, e => {
        e.preventDefault();
        const albumId = $(`[name="addPhotoToAlbum"]`).data(`id`);

        currentRestInterraction.uploadPhoto(`#addPhotoToAlbum`).then(photoURL => {
            currentRestInterraction.addPhotoToAlbum(albumId, photoURL, `[name="albumsContainer"]`);
        });    
    });//ADD PHOTO TO ALBUM INPUT CHANGE CLICK

    $(`body`).on(`click`, `[name="deletePhoto"]`, function(e) {
        e.preventDefault();
        const albumId = $(this).closest(`.tab-content`).find(`.button`).data(`id`);
        const photoId = $(this).data(`id`);
        currentRestInterraction.deletePhotoFromAbum(photoId, albumId, `[name="albumsContainer"]`);
    });//DELETE PHOTO LINK CLICK

    // PROFILE SETTINGS TABS
    $(`body`).on(`click`, `.link:not(.active)`, function(e) {
        e.preventDefault();
        $(this)
          .addClass(`active`).parent().siblings().find(`a`).removeClass(`active`)
          .closest(`.tabs`)
          .find(`.tab-content`)
          .removeClass(`active`).eq($(this).parent().index()).addClass(`active`);
    });

    // REGISTER VALIDATION
    $(`body`).on(`blur`, `[name="username"]`, () => {
        currentValidation.usernameValidate(`[name="username"]`);
    }); //USERNAME VALIDATION

    $(`body`).on(`blur`, `[name="email"]`, () => {
        currentValidation.emailValidate(`[name="email"]`);
    }); //EMAIL VALIDATION

    $(`body`).on(`blur`, `[name="password"]`, () => {
        currentValidation.passwordValidate(`[name="password"]`, `[name="confirmPass"]`);
    }); //PASSWORD VALIDATION

    $(`body`).on(`blur`, `[name="confirmPass"]`, () => {
        currentValidation.confirmPassValidate(`[name="password"]`, `[name="confirmPass"]`);
    }); //PASSWORD MATCH VALIDATION
    
    $(`body`).on(`keypress`, `[name="password"]`, e => {
        functions.capsDetection(e, `[name="password"]`);
    });//CAPS LOOK DETECTION

    $(`body`).on(`keypress`, `[name="confirmPass"]`, e => {
        functions.capsDetection(e, `[name="confirmPass"]`);
    });//CAPS LOOK DETECTION

    $(`body`).on(`blur`, `[name="captcha"]`, () => {
        currentValidation.captchaValidate(`[name="captcha"]`);
    }); //CAPTCHA VALIDATION

    $(`body`).on(`blur`, `[name="firstname"]`, () => {
        currentValidation.nameValidate(`[name="firstname"]`);
    }); //FIRSTNAME VALIDATION

    $(`body`).on(`blur`, `[name="lastname"]`, () => {
        currentValidation.nameValidate(`[name="lastname"]`);
    }); //LASTNAME VALIDATION

}());