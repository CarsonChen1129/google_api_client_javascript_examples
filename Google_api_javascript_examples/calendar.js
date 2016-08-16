/* ========= ACL ========== */
        /**
         * Deletes an access control rule
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} ruleId ACL rule identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function deleteAcl(calendarId, ruleId, callback) {
            gapi.client.calendar.acl.delete({
                'calendarId': calendarId,
                'ruleId': ruleId
            }).execute(callback);
        }

        /**
         * Returns an access control rule
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} ruleId ACL rule identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function getAcl(calendarId, ruleId, callback) {
            gapi.client.calendar.acl.get({
                'calendarId': calendarId,
                'ruleId': ruleId
            }).execute(callback);
        }


        /**
         * Creates an access control rule
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} scopeType The type of the scope.
         * Possible values are:
         "default" - The public scope. This is the default value.
         "user" - Limits the scope to a single user.
         "group" - Limits the scope to a group.
         "domain" - Limits the scope to a domain.
         Note: The permissions granted to the "default", or public, scope apply to any user, authenticated or not.
         * @param {String} scopeEmail The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type "default".
         * @param {String} role The role assigned to the scope.
         * Possible values are:
         "none" - Provides no access.
         "freeBusyReader" - Provides read access to free/busy information.
         "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
         "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
         "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function insertAct(calendarId, scopeType, scopeEmail, role, callback) {
            var rule = {
                'scope': {
                    'type': scopeType,
                    'value': scopeEmail
                },
                'role': role
            };
            gapi.client.calendar.acl.insert({
                'calendarId': calendarId,
                'body': rule
            }).execute(callback);
        }

        /**
         * Returns the rules in the access control list for the calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listAcl(calendarId, callback) {
            gapi.client.calendar.acl.list({
                'calendarId': calendarId
            }).execute(callback);
        }

        /**
         * Update an access control rule
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} ruleId ACL rule identifier.
         * @param {String} role The role assigned to the scope.
         * Possible values are:
         "none" - Provides no access.
         "freeBusyReader" - Provides read access to free/busy information.
         "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
         "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
         "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function updateAcl(calendarId, ruleId, role, callback) {
            getAcl(calendarId, ruleId, function (rule) {
                rule.role = role;
                gapi.client.calendar.acl.update({
                    'calendarId': calendarId,
                    'ruleId': rule.id,
                    'body': rule
                }).execute(callback)
            })
        }

        /* =============Calendar List ======= */
        /**
         * Deletes an entry on the user's calendar list
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function deleteCalendarList(calendarId, callback) {
            gapi.client.calendar.calendarList.delete({
                'calendarId': calendarId
            }).execute(callback);
        }


        /**
         * Returns an entry on the user's calendar list
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function getCalendarList(calendarId, callback) {
            gapi.client.calendar.calendarList.get({
                'calendarId': calendarId
            }).execute(callback);
        }

        /**
         * Creates a secondary calendar
         *
         * @param {String} calendarId Calendar identifier that creates by the user
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function insertCalendarList(calendarId, callback) {
            var event = {
                'id': calendarId
            };
            gapi.client.calendar.calendarList.insert({
                'body': event
            }).execute(callback);
        }

        /**
         * Returns entries on the user's calendar list
         *
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listCalendarList(callback) {
            var getCalendarList = function (request, result) {
                request.execute(function (resp) {
                    result = result.concat(resp.items);
                    var nextPageToken = resp.nextPageToken;
                    if (nextPageToken) {
                        request = gapi.client.calendar.calendarList.list({
                            'pageToken': nextPageToken
                        });
                        getCalendarList(request, result);
                    } else {
                        callback(result);
                    }
                });
            };
            var initialRequest = gapi.client.calendar.calendarList.list({});
            getCalendarList(initialRequest, []);
        }

        /**
         * Update an entry on the user's calendar list
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Object} event Event. Note: Make sure to get and modify your events in advance
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function updateCalendarList(calendarId, event, callback) {
            gapi.client.calendar.calendarList.update({
                'calendarId': calendarId,
                'body': event
            }).execute(callback);
        }

        /* ============ Calendar ========== */
        /**
         * Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account
         *
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function clearCalendar(callback) {
            gapi.client.calendar.calendars.clear({
                'calendarId': 'primary'
            }).execute(callback);
        }

        /**
         * Deletes a secondary calendar. use calendars.clear for clearing all events on primary calendars
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function deleteCalendar(calendarId, callback) {
            gapi.client.calendar.calendars.delete({
                'calendarId': calendarId
            }).execute(callback);
        }

        /**
         * Returns a metadata for a calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function getCalendars(calendarId, callback) {
            gapi.client.calendar.calendars.get({
                'calendarId': calendarId
            }).execute(callback);
        }

        /**
         * Creates a secondary calendar
         *
         * @param {String} summary Title of the calendar
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function insertCalendar(summary, callback) {
            console.log(moment.tz.Zone.name);
            var calendar = {
                'summary': summary,
                'timeZone': 'America/New_York'
            };
            gapi.client.calendar.calendars.insert({
                'body': calendar
            }).execute(callback);
        }

        /**
         *
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Object} event Event. Note: Make sure to get and modify your events in advance
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function updateCalendar(calendarId, event, callback) {
            gapi.client.calendar.calendars.update({
                'calendarId': calendarId,
                'body': event
            }).execute(callback);
        }


        /* ============= Events =========== */
        /**
         * Deletes an event
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} eventId Event identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function deleteAnEvent(calendarId, eventId, callback) {
            gapi.client.calendar.events.delete({
                'calendarId': calendarId,
                'eventId': eventId
            }).execute(callback);
        }

        /**
         * Returns an event
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} eventId Event identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function getEventDetail(calendarId, eventId, callback) {
            gapi.client.calendar.events.get({
                'calendarId': calendarId,
                'eventId': eventId
            }).execute(callback);
        }

        /**
         * Imports an event. This operation is used to add a private copy of any existing event to a calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Object} event Event.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function importEvent(calendarId, event, callback) {
            gapi.client.calendar.events.import({
                'calendarId': calendarId,
                'body': event
            }).execute(callback)
        }

        /**
         * Creates a calendar event
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Object} event Event.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function insertEvent(calendarId, event, callback) {
            gapi.client.calendar.events.insert({
                'calendarId': calendarId,
                'body': event
            }).execute(callback)
        }


        /**
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Object} event Event.
         * @param {String} recurrence Recurrence info added to the event
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function insertRecurringEvent(calendarId, event, recurrence, callback) {
            event['recurrence'] = [recurrence];
            gapi.client.calendar.events.insert({
                'calendarId': calendarId,
                'body': event
            }).execute(callback)
        }

        /**
         * Returns instances of the specified recurring event
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} eventId Event identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function instanceOfRecurringEvent(calendarId, eventId, callback) {
            var getInstanceOfRecurringEvent = function (request, result) {
                request.execute(function (resp) {
                    result = result.concat(resp.items);
                    var nextPageToken = resp.nextPageToken;
                    if (nextPageToken) {
                        request = gapi.client.calendar.events.instances({
                            'calendarId': calendarId,
                            'eventId': eventId,
                            'pageToken': nextPageToken
                        });
                        getInstanceOfRecurringEvent(request, result);
                    } else {
                        callback(result);
                    }
                });
            };

            var initialRequest = gapi.client.calendar.events.instances({
                'calendarId': calendarId,
                'eventId': eventId
            });
            getInstanceOfRecurringEvent(initialRequest, []);
        }

        /**
         * Return a list of the next 10 events on the user's calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listUpcomingTenEvents(calendarId, callback) {
            gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeMin': (new Date()).toISOString(),
                'maxResults': 10,
                'singleEvents': true,
                'orderBy': 'startTime'
            }).execute(callback);
        }


        /**
         * Return a list of today's events on the user's calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listTodayEvents(calendarId, callback) {
            var startTime = new Date();
            var endTime = new Date();
            endTime.setDate(endTime.getDate() + 1);
            endTime.setHours(0, 0, 0, 0);
            if (configs.debug) {
                console.log("startTime: " + startTime);
                console.log("endTime: " + endTime);
            }
            gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeMin': startTime.toISOString(),
                'timeMax': endTime.toISOString(),
                'singleEvents': true,
                'orderBy': 'startTime'
            }).execute(callback);
        }

        /**
         * Returns events on the specified calendar
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listEvents(calendarId, callback) {
            var getEventList = function (request, result) {
                request.execute(function (resp) {
                    result = result.concat(resp.items);
                    var nextPageToken = resp.nextPageToken;
                    if (nextPageToken) {
                        request = gapi.client.calendar.events({
                            'calendarId': calendarId,
                            'pageToken': nextPageToken,
                            'timeZone': 'UTC'
                        });
                        getEventList(request, result);
                    } else {
                        callback(result);
                    }
                });
            };
            var initialRequest = gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeZone': 'UTC'
            });
            getEventList(initialRequest, []);
        }

        /**
         * Moves an event to another calendar, i.e. changes an event's organizer
         *
         * @param {String} oldCalendarId Old calendar identifier.
         * @param {String} eventId Event identifier.
         * @param {String} newCalendarId New calendar identifier.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function moveEvent(oldCalendarId, eventId, newCalendarId, callback) {
            gapi.client.calendar.events.move({
                'calendarId': oldCalendarId,
                'eventId': eventId,
                'destination': newCalendarId
            }).execute(callback);
        }

        /**
         * Creates an event based on a simple text string
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} text The text describing the event to be created.
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function quickAddEvent(calendarId, text, callback) {
            gapi.client.calendar.events.quickAdd({
                'calendarId': calendarId,
                'text': text
            }).execute(callback);
        }


        /**
         * Updates an event
         *
         * @param {String} calendarId Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
         * If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
         * @param {String} eventId Event identifier.
         * @param {Object} event Event. Note: Make sure to get and modify your events in advance
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function updateEvent(calendarId, eventId, event, callback) {
            gapi.client.calendar.events.update({
                'calendarId': calendarId,
                'eventId': eventId,
                'body': event
            }).execute(callback);
        }


        /* ============ Settings ========= */
        /**
         * Returns a single user setting
         *
         * @param {String} settingId The id of the user setting
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function getSetting(settingId, callback) {
            gapi.client.calendar.settings.get({
                'setting': settingId
            }).execute(callback);
        }

        /**
         * Returns all user settings for the authenticated user
         *
         * @param {Function} callback callback Function to call when the request is complete.
         */
        function listSettings(callback) {
            gapi.client.calendar.settings.list().execute(callback);
        }
