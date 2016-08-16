/* ============== Drafts ============= */

        /**
         * Create Draft email.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} email RFC 2822 formatted String.
         * @param  {Boolean} attachment a boolean value to indicate attachment
         * @param  {Function} callback Function to call when the request is complete.
         */
        function createDraft(userId, email, attachment, callback) {
            var base64EncodedEmail = Base64.encode(email).replace(/\//g,'_').replace(/\+/g,'-');
            if (attachment) {
                gapi.client.gmail.users.drafts.create({
                    'userId': userId,
                    'message': {
                        'raw': base64EncodedEmail
                    }
                }).execute(callback);
            }else{
                gapi.client.gmail.users.drafts.create({
                    'userId': userId,
                    'message': {
                        'raw': base64EncodedEmail
                    }
                }).execute(callback);
            }
        }

        /**
         * Delete Draft with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} draftId ID of Draft to delete.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function deleteDraft(userId, draftId,callback) {
            var request = gapi.client.gmail.users.drafts.delete({
                'userId': userId,
                'id': draftId
            });
            request.execute(callback);
        }

        /**
         * Get Draft with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} draftId ID of Draft to get.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function getDraftDetail(userId, draftId, callback) {
            var request = gapi.client.gmail.users.drafts.get({
                'userId': userId,
                'id': draftId
            });
            request.execute(callback);
        }

        /**
         * Retrieve an array of Drafts.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function listDrafts(userId, callback) {
            var request = gapi.client.gmail.users.drafts.list({
                'userId': userId
            });
            request.execute(function(resp) {
                var drafts = resp.drafts;
                callback(drafts);
            });
        }

        /**
         * Replace Message within Draft with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} draftId ID of Draft to update.
         * @param  {String} updatedEmail RFC 2822 formatted String.
         * @param  {Boolean} send Send or not send Draft once updated.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function updateDraft(userId, draftId, updatedEmail, send, callback) {
            var base64UpdatedEmail = Base64.encode(updatedEmail).replace(/\//g,'_').replace(/\+/g,'-');
            var request = gapi.client.gmail.users.drafts.update({
                'userId': userId,
                'id': draftId,
                'message': {
                    'raw': base64UpdatedEmail
                },
                'send': send
            });
            request.execute(callback);
        }


        /* ============== Emails ============= */
        /**
         * Delete Message with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} messageId ID of Message to delete.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function deleteMessage(userId, messageId, callback) {
            var request = gapi.client.gmail.users.messages.delete({
                'userId': userId,
                'id': messageId
            });
            request.execute(callback);
        }

        /**
         * Get Message with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} messageId ID of Message to get.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function getEmailDetail(userId, messageId, callback) {
            var request = gapi.client.gmail.users.messages.get({
                'userId': userId,
                'id': messageId
            });
            request.execute(callback);
        }

        /**
         * Insert Message into user's mailbox.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} email RFC 2822 formatted String.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function insertMessage(userId, email, callback) {
            var base64EncodedEmail = Base64.encode(email).replace(/\//g,'_').replace(/\+/g,'-');
            var request = gapi.client.gmail.users.messages.insert({
                'userId': userId,
                'message': {
                    'raw': base64EncodedEmail
                }
            });
            request.execute(callback);
        }

        /**
         * Retrieve Messages in user's mailbox matching query.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} query String used to filter the Messages listed.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function getEmailList(userId, query, callback) {
            var getPageOfMessages = function(request, result) {
                request.execute(function(resp) {
                    result = result.concat(resp.messages);
                    var nextPageToken = resp.nextPageToken;
                    if (nextPageToken) {
                        request = gapi.client.gmail.users.messages.list({
                            'userId': userId,
                            'pageToken': nextPageToken,
                            'q': query
                        });
                        getPageOfMessages(request, result);
                    } else {
                        callback(result);
                    }
                });
            };
            var initialRequest = gapi.client.gmail.users.messages.list({
                'userId': userId,
                'q': query
            });
            getPageOfMessages(initialRequest, []);
        }

        /**
         * Modify the Labels a Message is associated with.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} messageId ID of Message to modify.
         * @param  {Array} labelsToAdd Array of Labels to add.
         * @param  {Array} labelsToRemove Array of Labels to remove.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function modifyMessage(userId, messageId, labelsToAdd, labelsToRemove, callback) {
            var request = gapi.client.gmail.users.messages.modify({
                'userId': userId,
                'id': messageId,
                'addLabelIds': labelsToAdd,
                'removeLabelIds': labelsToRemove
            });
            request.execute(callback);
        }

        /**
         * Send Message.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} email RFC 2822 formatted String.
         * @param  {Boolean} attachment a boolean value to indicate attachment
         * @param  {Function} callback Function to call when the request is complete.
         */
        function sendMessage(userId, email, attachment, callback) {
            var base64EncodedEmail = Base64.encode(email).replace(/\//g,'_').replace(/\+/g,'-');
            if (attachment) {
                gapi.client.gmail.users.messages.send({
                    'userId': userId,
                    'message': {
                        'raw': base64EncodedEmail
                    }
                }).execute(callback);
            } else {
                gapi.client.gmail.users.messages.send({
                    'userId': userId,
                    'resource': {
                        'raw': base64EncodedEmail
                    }
                }).execute(callback);
            }

        }

        /**
         * Get Attachments from a given Message.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {Object} message Message object
         * @param  {Function} callback Function to call when the request is complete.
         */
        function getEmailAttachments(userId, message, callback) {
            var parts = message.payload.parts;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part.filename && part.filename.length > 0) {
                    var attachId = part.body.attachmentId;
                    var request = gapi.client.gmail.users.messages.attachments.get({
                        'id': attachId,
                        'messageId': message.id,
                        'userId': userId
                    });
                    request.execute(function(attachment) {
                        callback(part.filename, part.mimeType, attachment);
                    });
                }
            }
        }

        /**
         * Get single attachment from a given Message
         * 
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} msg_id ID of Message with attachments.
         * @param  {String} att_id ID of the attachment
         * @param  {Function} callback Function to call when the request is complete.
         */
        function getEmailAttachment(userId, msg_id,att_id, callback) {
                if (filename && filename.length > 0) {
                    var request = gapi.client.gmail.users.messages.attachments.get({
                        'id': att_id,
                        'messageId': msg_id,
                        'userId': userId
                    });
                    request.execute(function(attachment) {
                        callback(attachment);
                    });
                }
        }

        /* ================ Labels ============== */
        /**
         * Add a new Label to user's mailbox.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} newLabelName Name of the new Label.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function createLabel(userId, newLabelName, callback) {
            var request = gapi.client.gmail.users.labels.create({
                'userId': userId,
                'label': {
                    'name': newLabelName
                }
            });
            request.execute(callback);
        }

        /**
         * Delete Label with given ID.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} labelId ID of Label to delete.
         */
        function deleteLabel(userId, labelId) {
            var request = gapi.client.gmail.users.labels.delete({
                'userId': userId,
                'id': labelId
            });
            request.execute(function(resp) { });
        }

        /**
         * Get all the Labels in the user's mailbox.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function listLabels(userId, callback) {
            var request = gapi.client.gmail.users.labels.list({
                'userId': userId
            });
            request.execute(function(resp) {
                var labels = resp.labels;
                callback(labels);
            });
        }

        /**
         * Update an existing Label.
         *
         * @param  {String} userId User's email address. The special value 'me'
         * can be used to indicate the authenticated user.
         * @param  {String} labelId ID of Label to be updated.
         * @param  {String} labelName Updated name.
         * @param  {String} labelListVisibility Updated Label list visibility.
         * @param  {String} messageListVisibility Updated Message list visibility.
         * @param  {Function} callback Function to call when the request is complete.
         */
        function updateLabel(userId, labelId, labelName, labelListVisibility, messageListVisibility, callback) {
            var request = gapi.client.gmail.users.labels.update({
                'userId': userId,
                'id': labelId,
                'label': {
                    'id': labelId,
                    'name': labelName,
                    'labelListVisibility': labelListVisibility,
                    'messageListVisibility': messageListVisibility
                }
            });
            request.execute(callback);
        }



        /* ================End of this section================  */
