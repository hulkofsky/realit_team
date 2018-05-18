`use strict`;

import $ from 'jquery';
import Handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
import Validation from './validation.js';
import Functions from './functions.js';
import Render from './render.js'
import { setTimeout } from 'timers';

export default class RestInterraction {
    wrapper(){
        return $(`.wrapper`);
    };

    redirectToLogin(){
        const _this = this;
        const functions = new Functions();

        functions.showModal(`errorModal`, `body`, `Sorry, Your session is over. You will be redirected to login page.`)
        setTimeout(() => {
            _this.init();
            functions.deleteModal(`errorModal`)
        }, 3000);
    }; //REDIRECT TO LOGIN

    init(wallContainerSelector, rightContSelector){
        const functions = new Functions();
        const render = new Render();
        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            const _this = this

            $.ajax({
                url: `http://restapi.fintegro.com/profiles`, 
                method: `GET`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    const year = new Date();
                    const profileContext = {
                        profile: data.profile,

                        friendsCount: data.friends_count,
                        enemiesCount: data.enemies_count,
                        currentYear: year.getFullYear(),
                        };
                    const userListContext = {   userId: data.profile.user_id,
                                                friends: data.friends,
                                                enemies: data.enemies
                                            };

                    render.profilePage(profileContext);
                    this.getUserPosts(data.profile.user_id, wallContainerSelector);
                    
                    setTimeout(() => {
                       render.userList(rightContSelector, userListContext);
                    }, 300);    
                }
            });
        } else {
            render.loginPage();
        }
    };  //INIT

    profileSettings(containerSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/profiles`, 
                method: `GET`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    render.profileSettingsPage(containerSelector, data);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };  //PROFILE SETTINGS

    showYourNews(wallContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/news`, 
                method: `GET`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    render.newsPage(wallContSelector, data);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//SHOW YOUR NEWS

    showUsersProfile(userId, wallContainerSelector, rightContSelector){
        const functions = new Functions();
        const render = new Render();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${userId}`, 
                method: `GET`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    const year = new Date();
                    const profileContext = {
                        profile: data.profile,
                        
                        friendsCount: data.friends_count,
                        enemiesCount: data.enemies_count,
                        currentYear: year.getFullYear(),
                        };
                    const userListContext = {
                        userId: data.profile.user_id,
                        friends: data.friends,
                        enemies: data.enemies,
                        btnStatus: `hidden`
                    };

                    render.profilePage(profileContext);
                    
                    setTimeout(() => {
                      render.userList(rightContSelector, userListContext);
                    }, 300);   
                    _this.getUserPosts(userId, wallContainerSelector);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//SHOW USERS PROFILE

    removeProfile(){
        const functions = new Functions();
        const render = new Render();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${localStorage.userId}`, 
                method: `DELETE`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    functions.showModal(`successModal`, `body`, `Your profile succesfully deleted. You will be redirected to login page`);
                    setTimeout(() => {
                        _this.logout();
                        _this.init();
                        functions.deleteModal(`successModal`)
                    }, 3000);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//REMOVE PROFILE

    login(usernameFieldSelector, passwordFieldSelector, loginButtonSelector, yearContainerSelector, wallContainerSelector, rightContSelector){
        const formValidation = new Validation();
        const functions = new Functions();
        if (formValidation.loginValidate(usernameFieldSelector, passwordFieldSelector)) {
           const _this = this;
           
            $.ajax({
                url: `http://restapi.fintegro.com/login`, 
                method: `POST`,
                dataType: `json`,
                data: {
                    username: $(usernameFieldSelector).val(),
                    password: $(passwordFieldSelector).val()
                },
                
                success: data => {
                    const date = new Date(new Date().getTime() + 6000 * 1000);
                    localStorage.userId = data.profile.user_id;
                    document.cookie = `session-token=${data.token}; expires=${date.toUTCString()}`;
                    _this.init(wallContainerSelector, rightContSelector);
                }, 

                beforeSend: () => {
                    $(loginButtonSelector).html(`<img width="30" src="img/Cube.svg">`);
                },

                error: (xhr, status, error) => {
                    $(`.inputError`).remove();
                    functions.showMessage(`inputError`, loginButtonSelector, `User with this login/password combination not found!`);
                    $(loginButtonSelector).html(`Login`);
                }
            });
        };
    }; //LOGIN

    logout(){
        document.cookie = `session-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        this.init();
    }; //LOGOUT

    searchUserProfiles(searchCriteria, containerSelector){
        const render = new Render();
        const functions = new Functions();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/search`, 
                method: `GET`,
                dataType: `json`,
                data: {
                    search: searchCriteria
                },

                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    render.searchResults(containerSelector, data);
                }, 

                beforeSend: () => {
                    $(containerSelector).html(`<img width="30" src="img/Cube.svg">`);
                }
            });
        };
    };//SEARCH USER PROFILES

    addFriendOrEnemy(userId, friendOrEnemy, userName, rightContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/social-activities`, 
                method: `POST`,
                dataType: `json`,
                data: {
                    user_id: userId,
                    type: friendOrEnemy
                },

                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.getYourFriendsEnemies(data, rightContSelector);
                }
            });
        };
    };//FOLLOW USER
    
    viewFriendsOrEnemies(containerSelector, friendOrEnemy, userId){
        const functions = new Functions();
        const render = new Render();
        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/social-activities/${userId}`, 
                method: `GET`,
                dataType: `json`,

                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    let context;
                    if(friendOrEnemy == 1){
                        if(localStorage.userId != userId) {
                            context = {
                                btnStatus: `hidden`,
                                userList: data.friends,
                                typeOfList: `friends`
                            };
                        } else {
                            context = {
                                userList: data.friends,
                                typeOfList: `friends`
                            };
                        };
                        render.allFriendsOrEnemies(containerSelector, context);
                    };
                    
                    if(friendOrEnemy == 2){
                        if(localStorage.userId != userId) {
                            context = {
                                btnStatus: `hidden`,
                                userList: data.enemies,
                                typeOfList: `enemies`
                            };
                        } else {
                            context = {
                                userList: data.enemies,
                                typeOfList: `enemies`
                            };
                        };
                        render.allFriendsOrEnemies(containerSelector, context);
                    };    
                }
            });
        };
    };//VIEW FRIENDS OR ENEMIES

    deleteUserFromList(userId, userName, rightContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/social-activities/${userId}`, 
                method: `DELETE`,
                dataType: `json`, 
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.getYourFriendsEnemies(data, rightContSelector);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//DELETE USER FROM LIST

    getYourFriendsEnemies(data, rightContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/social-activities/${localStorage.userId}`, 
                method: `GET`,
                dataType: `json`,

                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    const userListContext = {   
                        userId: localStorage.userId,
                        friends: data.friends,
                        enemies: data.enemies
                    };

                    render.userList(rightContSelector, userListContext);  
                }
            });
        };
    };

    registration(registerFieldSelectors){

        const formValidation = new Validation();
        const functions = new Functions();
        const _this = this;
        const noValidationErrors = formValidation.formValidate(registerFieldSelectors);

        if (noValidationErrors) {
            $.ajax({
                url: `http://restapi.fintegro.com/registration`, 
                method: `POST`,
                dataType: `json`,
                data: {
                    login: $(registerFieldSelectors.username).val(),
                    email: $(registerFieldSelectors.email).val(),
                    password: $(registerFieldSelectors.password).val(),
                    firstname: $(registerFieldSelectors.firstname).val(),
                    lastname: $(registerFieldSelectors.lastname).val()
                },

                success: (data) => {
                    functions.messageDelete(`inputError`, registerFieldSelectors.registerButton)
                    functions.showMessage(`success`, registerFieldSelectors.registerButton, `Your account was succesfully created!`);    
                    setTimeout(() => {
                        _this.init();
                    }, 3000);
                }, 

                beforeSend: () => {
                    $(registerFieldSelectors.registerButton).html(`<img width="30" src="img/Cube.svg">`);
                },

                error: (xhr) => {
                    const errors = ($.parseJSON(xhr.responseText)).errors;

                    $(registerFieldSelectors.registerButton).html(`Register`);
                    functions.showMessage(`inputError`, registerFieldSelectors.registerButton, ``);

                    for(let errorItem in errors) {
                        $(`.inputError`).append(`<p>${errors[errorItem]}</p>`);
                    };
                }

            });
        };
    };//REGISTRATION

    sendPassRecoverRequest(emailFieldSelector, buttonSelector){
        const functions = new Functions();
        const formValidation = new Validation();

        if(formValidation.emailValidate(emailFieldSelector)){
            $.ajax({
                url: `http://restapi.fintegro.com/recovery`, 
                method: `POST`,
                dataType: `json`,
                data: {
                    email: $(emailFieldSelector).val()
                },
                success: (data) => {
                    functions.messageDelete(`inputError`, buttonSelector);
                    functions.showMessage(`success`, buttonSelector, `A new password was send to your Email!`);
                    $(buttonSelector).html(`Send`);
                }, 
                beforeSend: () => {
                    $(buttonSelector).html(`<img width="30" src="img/Cube.svg">`);
                },
    
                error: (xhr) => {
                    $(buttonSelector).html(`Send`);
                    if(xhr.status == 404){
                        functions.showMessage(`inputError`, buttonSelector, `This Email is not registered in our database.`);
                    } else {
                        functions.showMessage(`inputError`, buttonSelector, `Internal server error.`);
                    };   
                }
            });
        };
    };//RECOVER PASSWORD

    updateProfileInfo(updateInfoFields){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${localStorage.userId}`, 
                method: `PUT`,
                dataType: `json`, 

                data: {
                    firstname: updateInfoFields.firstname,
                    lastname: updateInfoFields.lastname,
                    quote: updateInfoFields.quote,
                    photo: updateInfoFields.photo,
                    lived: updateInfoFields.lived,  
                    from: updateInfoFields.from,
                    went: updateInfoFields.went
                },

                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    functions.showModal(`successModal`, this.wrapper(), `Your personal information has been updated succesfully!`);
                    setTimeout(() => {
                        functions.deleteModal(`successModal`);
                    }, 2000)
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//UPDATE PROFILE SETTINGS

    uploadPhoto(fieldSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            let formData = new FormData();
            const file = $(fieldSelector).prop(`files`)[0];
            
            return new Promise((resolve, reject) => {
                if (file) {
                    formData.append(`UploadForm[imageFile]`, file);
                    
                    $.ajax({
                        url: `http://restapi.fintegro.com/upload`, 
                        method: `POST`,
                        dataType: `json`, 
                        data: formData,
                        
                        headers: {
                            bearer: sessionToken
                        },
        
                        crossDomain: true,
                        cache: false,
                        contentType: false,
                        processData: false,
        
                        success: function(data) {
                            resolve(data.link, data.id);
                        }
                    });
                } else {
                    reject();
                };    
            }); 
        } else {
            this.redirectToLogin();
        }
    };//UPLOAD PHOTO

    addPhotoToPreview(containerSelector, inputFileSelector){
        this.uploadPhoto(inputFileSelector).then((photoURL, photoId) => {

            if(!$(`div`).is(`.photos-preview`)) {
                $(containerSelector).append(`<div class="photos-preview">
                                                <div class="photo-wrapper">
                                                    <img class="photo" src="${photoURL}" alt="post-photo">
                                                    <a class="remove-preview" data-id="${photoId}" href="#">Remove</a>
                                                </div>                                
                                            </div>`);
            } else {
                $(`.photos-preview`).append(`<div class="photo-wrapper">
                                            <img class="photo" src="${photoURL}" alt="post-photo">
                                            <a class="remove-preview" href="#">Remove</a>
                                        </div>`);
            };
        });
    }; //ADD PHOTO TO POST

    createPost(textFieldVal, photoPreviewSelector, wallContainerSelector){
        const functions = new Functions();
        const render = new Render();
        const _this = this;
        const images = $(photoPreviewSelector).find(`img`);
        let url;
        let photoURLs = [];

        $.each(images, (index, val) => {
            url = $(images[index]).attr(`src`);
            photoURLs.push({url});
        });

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/posts`, 
                method: `POST`,
                dataType: `json`, 
                data: {
                    text: textFieldVal,
                    media: photoURLs
                },
                
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    _this.getUserPosts(data.user_id, wallContainerSelector);
                    $(photoPreviewSelector).remove();
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//CREATE POST

    removePost(postId, wallContainerSelector){
        const functions = new Functions();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/posts/${postId}`, 
                method: `DELETE`,
                dataType: `json`, 
                
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    _this.getUserPosts(localStorage.userId, wallContainerSelector);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//REMOVE POST

    getUserPosts(userId, wallContainerSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/posts/${userId}`, 
                method: `GET`,
                dataType: `json`,
                data: {
                 
                },
                
                headers: {
                    bearer: sessionToken
                },

                success: (data) => {
                    let context;

                    if(localStorage.userId != userId) {
                        context = {
                                        posts: data.posts,
                                        linkStatus: `hidden`
                                    }
                    } else {
                        context = data;
                    };
                    render.userPosts(context, wallContainerSelector);
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //GET USER POSTS

    

    addCommentToPost(text, postId, wallContainerSelector){
        const functions = new Functions();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/comments`, 
                method: `POST`,
                dataType: `json`,
                data: {
                    text: text,
                    post_id: postId
                },
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.getUserPosts(localStorage.userId, wallContainerSelector);
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //ADD COMMENT TO POST

    removePostComment(commentId, wallContainerSelector){
        const functions = new Functions();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/comments/${commentId}`, 
                method: `DELETE`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.getUserPosts(localStorage.userId, wallContainerSelector);
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //REMOVE POST COMMENT

    getAlbums(contSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/albums`, 
                method: `GET`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    render.albums(contSelector, data);
                }
            });
        } else {
            this.redirectToLogin();
        };
        
    }; //GET ALBUMS

    createAlbum(albumName){
        const functions = new Functions();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/albums`, 
                method: `POST`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                data: {
                    name: albumName
                },

                success: data => {
                    functions.showModal(`successModal`, this.wrapper(), `Album "${albumName}" succesfully created!`);
                    setTimeout(() => {
                        functions.deleteModal(`successModal`);
                    }, 2000);   
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //CREATE ALBUM
 
    openAlbum(albumId, photoContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/albums/${albumId}`, 
                method: `GET`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    render.photosPage(photoContSelector, data);
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //OPEN ALBUM

    deleteAlbum(albumId, albumsContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/albums/${albumId}`, 
                method: `DELETE`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.getAlbums(albumsContSelector);  
                }
            });
        } else {
            this.redirectToLogin();
        };
    };//DELETE ALBUM

    addPhotoToAlbum(albumId, URL, albumContSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/photos`, 
                method: `POST`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                data: {
                    album_id: albumId,
                    url: URL
                },
                success: data => {
                    this.openAlbum(albumId, albumContSelector);
                }
            });
        } else {
            this.redirectToLogin();
        };
    };//ADD PHOTO TO ALBUM

    deletePhotoFromPreview(photoId, removeLinkSelector) {
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/photos/${photoId}`, 
                method: `DELETE`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    $(removeLinkSelector).parent().remove();
                }
            });
        } else {
            this.redirectToLogin();
        };
    }; //DELETE PHOTO FROM PREVIEW

    deletePhotoFromAbum(photoId, albumId, contSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            
            $.ajax({
                url: `http://restapi.fintegro.com/photos/${photoId}`, 
                method: `DELETE`,
                dataType: `json`,
                
                headers: {
                    bearer: sessionToken
                },

                success: data => {
                    this.openAlbum(albumId, contSelector);
                }
            });
        } else {
            this.redirectToLogin();
        };
    };//DELETE PHOTO
};