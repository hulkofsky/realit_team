`use strict`;
import $ from 'jquery';
import Handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
import Functions from './functions.js';

export default class Render{
    wrapper(){
        return $(`.wrapper`);
    };

    loadTemplate(url, container, context){
        let template;
        $.get(url, (response) => {
            template = Handlebars.compile(response);
            if(context) {
                template = template(context);
            }
            container.html(template);
        });
    }; //LOAD TEMPLATE

    loginPage(){
        this.loadTemplate(`./src/views/login.hbs`, this.wrapper());
    };//LOGIN PAGE

    profilePage(data){
        this.loadTemplate(`./src/views/profile.hbs`, this.wrapper(), data); 
    };//PROFILE PAGE

    registerPage(){
        const functions = new Functions();
        const captcha = {   firstNumber: functions.random(1, 10),
                            lastNumber: functions.random(1, 10)
                        };
        this.loadTemplate(`./src/views/register.hbs`, this.wrapper(), captcha);
    };//PROFILE PAGE

    recoverPassPage(){
        this.loadTemplate(`./src/views/recoverPass.hbs`, this.wrapper());
    };//RECOVER PASS PAGE

    profileSettingsPage(containerSelector, data){
        const functions = new Functions();
        const context = {profile: {
                                firstName: data.profile.firstname,
                                lastName: data.profile.lastname,
                                quote: data.profile.quote,
                                photo: data.profile.photo,
                                lived: data.profile.lived,
                                from: data.profile.from,
                                went: data.profile.went
                            }
                        };
        
        const container = $(containerSelector);
        this.loadTemplate(`./src/views/profileSettings.hbs`, container, context);  
    };//PROFILE SETTINGS

    searchResults(containerSelector, context){
        const container = $(containerSelector);

        this.loadTemplate(`./src/views/searchResults.hbs`, container, context);
    };//SEARCH RESULTS

    allFriendsOrEnemies(containerSelector, context){
        const container = $(containerSelector);
        this.loadTemplate(`./src/views/allFriendsOrEnemies.hbs`, container, context);
    };//ALL FRIENDS OR ENEMIES

    userPosts(context, wallContainerSelector){
        const container = $(wallContainerSelector);
        this.loadTemplate(`./src/views/wall.hbs`, container, context);
    };//USER POSTS
};