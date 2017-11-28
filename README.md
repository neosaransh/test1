# Medimo-Labs-Inc.---Internship

How to open Parse Dashboard

    parse-dashboard --appId c1f18bb3-86b7-4f51-8cc2-fcaff9f3f04d --masterKey c8b885c5-d246-406e-9f83-4c856648f6a7 --serverURL https://medimoparse.azurewebsites.net --appName Medimo

# Submodule Configuration

Run this the first time pulling since 2017-08-24 11:11:35 EDT:

    git submodule init
    git submodule update
    cd custom-deps/react-motion-drawer
    npm i

# How to Start Backend Server

    # POSIX Shell (OSX, Linux, etc.)
    cd Backend
    PORT=3001 node bin/www

    # Windows
    cd Backend
    set PORT 3001
    node bin/www

# API Documentation

Place the session key received during login in the `x-medimo-api-session` HTTP request header for all requests that require authentication.

## Login

No authentication.

### Query

    POST /login

### Sample Request Body

    {
        "username": "john.doe",
        "password": "iloveponies"
    }

### Sample Response

    {
        "session_token": "r:uBhYfeg1tH4EALBEAAAC",
        "admin": false
    }

## Request Password Reset Email

No authentication.

### Query

    GET /passwordreset?username=*username*

### Sample Response

    {
        "masked_email": "nick******@gmail.com"
    }

## Reset Password

No authentication. To be used by page linked in password reset email only.

### Query

    POST /passwordreset

### Sample Request Body

    {
        "password": "iloveponies",
        "token": "Ez3bqFj1P4"
    }

### Sample Response

    {
        "success": true
    }

## Request New Patient

Authentication required (admin only). To be used by admin website to give new patients a sign-up code.

### Query

    POST /newpatient

### Sample Request Body

    {
        "name": "Test User",
        "username": "test.user",
        "dob": "2017-08-29",
        "gender": "Male",
        "ethnicity": "Caucasian"
    }

### Sample Response

    {
        "request_id": "GVh6jfK2rB"
    }

## Verify Patient Sign-Up Code

No authentication required. To be used by mobile app to show name and username for new patients during sign-up.

### Query

    GET /patient-signup?id=*request_id*

### Sample Response

    {
        "name": "Test User",
        "username": "test.user"
    }

## Sign Up Patient

No authentication required. To be used by mobile app to finalize patient sign-up.

### Query

    POST /patient-signup

### Sample Request Body

    {
        "email": "test.user@example.com",
        "password": "test"
    }

### Sample Response

    {
        "session_token": "r:0b57192f4e34a270530d09934c5b0df8"
    }

## Account Update

Authentication required. To be used to update email and/or password.

### Query

    POST /account-update

### Sample Request Body

    {
        "password": "password",
        "updates": {
            "password": "new-password",
            "email": "other.user@example.com"
        }
    }

### Sample Response

    {
        "success": true
    }

## Get Screens

Authentication required (provider or admin only). To be used by provider website to show available screens.

### Query

    GET /screens

### Sample Response

    [
        {
            "name": "ADHD",
            "instructions": "Please answer the questions, rating yourself on how you have felt and conducted yourself over the past 6 months. 1 = never, 2 = rarely, 3 = sometimes, 4 = often, 5 = very often",
            "id": "cVoVs7vz0d"
        }
    ]

## Get Screen Questions

Authentication required (provider or admin only). To be used by provider website to show questions for an available screen.

### Query

    GET /questions?id=*screen_id*

### Sample Response

    [
        {
            "screen": "cVoVs7vz0d",
            "text": "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
            "id": "Yw7xGTElAb"
        }
    ]

## Client List

Authentication required (provider or admin only). To be used by provider website to show a list of patients.

### Query

    GET /clientlist

### Sample Response

    [
        {
            "id": "TrhqMqKdzW",
            "name": "Nicolas Gnyra",
            "profileimg": "http://medimo-test.herokuapp.com/parse/files/bGbWSeIv6znyE7xctLTB/7894b3fdece512d7b34321ec839753a0_IMG_20170816_165507.jpg",
            "lastinteraction": "2017-08-24T19:31:32.700Z"
        }
    ]

## Client Profile

Authentication required (provider or admin only). To be used by provider website to show information about a client.

### Query

    GET /client?id=*client_id*

### Sample Response

    {
        "patient": {
            "id": "TrhqMqKdzW",
            "name": "Nicolas Gnyra",
            "profileimg": "http://medimo-test.herokuapp.com/parse/files/bGbWSeIv6znyE7xctLTB/7894b3fdece512d7b34321ec839753a0_IMG_20170816_165507.jpg"
        },
        "provider": {
            "name": "Other User",
            "id": "GihV9LI1yx"
        },
        "dateOfBirth": "2017-08-14T17:42:19.267Z",
        "gender": "Male",
        "ethnicity": "Caucasian"
    }

## Query Variable Over Time

Authentication required (provider or admin only). To be used by provider website to show data-over-time graphs.

### Query

    GET /query?client=*comma_separated_client_ids*&type=over-time&count=*number_of_series*&0_source_type=*series_0_source_type*&0_source_id=*series_0_source_id*&0_name=*series_0_name*&1_source_type=*series_1_source_type*&1_source_id=*series_1_source_id*&1_name=*series_1_name*

### Source Types

| Source Type            | Source ID Meaning                           |
|------------------------|---------------------------------------------|
| `mhr-field`            | Name of column on MHR object in database    |
| `user-field`           | Name of column on User object in database   |
| `mood`                 | N/A (must coerce to true)                   |
| `shake`                | Name of column on Shake objects in database |
| `screen-answer`        | ID of screen question object in database    |
| `calculated-attribute` | ID of calculated attribute in database      |

### Sample Response

    {
        "config": {
            "type": "over-time",
            "series": [
                {
                    "source_type": "screen-answer",
                    "source_id": "rYyxDbFiFN",
                    "name": "Weight over time"
                },
                {
                    "source_type": "screen-answer",
                    "source_id": "UXWQ0hIAhi",
                    "name": "Height over time"
                }
            ]
        },
        "result": [
            {
                "name": "Weight over time",
                "client": "Neil Asche",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "kg",
                            "value": 86.18
                        },
                        "timestamp": "2017-08-15T17:09:33.729Z"
                    }
                ]
            },
            {
                "name": "Weight over time",
                "client": "Lawrence Cheung",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "kg",
                            "value": 79.4
                        },
                        "timestamp": "2017-08-15T17:09:33.859Z"
                    }
                ]
            },
            {
                "name": "Height over time",
                "client": "Neil Asche",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "m",
                            "value": 1.778
                        },
                        "timestamp": "2017-08-15T17:09:33.729Z"
                    }
                ]
            },
            {
                "name": "Height over time",
                "client": "Lawrence Cheung",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "m",
                            "value": 1.803
                        },
                        "timestamp": "2017-08-15T17:09:33.861Z"
                    }
                ]
            }
        ]
    }

## Run Saved Query

Authentication required (provider or admin only). To be used by provider website to show graphs.

### Query

    GET /query?client=*client_id*&type=*saved*&id=*saved_query_id*

### Sample Response

    {
        "config": {
            "type": "over-time",
            "series": [
                {
                    "source_type": "screen-answer",
                    "source_id": "rYyxDbFiFN",
                    "name": "Weight over time"
                },
                {
                    "source_type": "screen-answer",
                    "source_id": "UXWQ0hIAhi",
                    "name": "Height over time"
                }
            ]
        },
        "result": [
            {
                "name": "Weight over time",
                "client": "Neil Asche",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "kg",
                            "value": 86.18
                        },
                        "timestamp": "2017-08-15T17:09:33.729Z"
                    }
                ]
            },
            {
                "name": "Weight over time",
                "client": "Lawrence Cheung",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "kg",
                            "value": 79.4
                        },
                        "timestamp": "2017-08-15T17:09:33.859Z"
                    }
                ]
            },
            {
                "name": "Height over time",
                "client": "Neil Asche",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "m",
                            "value": 1.778
                        },
                        "timestamp": "2017-08-15T17:09:33.729Z"
                    }
                ]
            },
            {
                "name": "Height over time",
                "client": "Lawrence Cheung",
                "results": [
                    {
                        "value": {
                            "type": "measurement",
                            "units": "m",
                            "value": 1.803
                        },
                        "timestamp": "2017-08-15T17:09:33.861Z"
                    }
                ]
            }
        ]
    }

## Saved Query List

Authentication required (provider or admin only). To be used by provider website to show available saved queryies.

### Query

    GET /querystore?me=*truthy_if_my_saved_queries_only*

### Sample Response

    [
        {
            "id": "Yjp8CqRE9A",
            "name": "Height and Weight",
            "config": {
                "type": "over-time",
                "series": [
                    {
                        "source_type": "screen-answer",
                        "source_id": "rYyxDbFiFN",
                        "name": "Weight over time"
                    },
                    {
                        "source_type": "screen-answer",
                        "source_id": "UXWQ0hIAhi",
                        "name": "Height over time"
                    }
                ]
            }
        }
    ]

## Save Query

Authentication required (provider or admin only). To be used by provider website to save a custom query configuration.

### Query

    POST /querystore

### Sample Request Body

    {
        "name": "Height and Weight",
        "config": {
            "type": "over-time",
            "series": [
                {
                    "source_type": "screen-answer",
                    "source_id": "rYyxDbFiFN",
                    "name": "Weight over time"
                },
                {
                    "source_type": "screen-answer",
                    "source_id": "UXWQ0hIAhi",
                    "name": "Height over time"
                }
            ]
        }
    }

### Sample Response

    {
      "id": "Yjp8CqRE9A"
    }

## Update Saved Query

Authentication required (provider or admin only). To be used by provider website to save a custom query configuration.

### Query

    POST /querystore

### Sample Request Body

    {
        "name": "Height and Weight",
        "id": "Yjp8CqRE9A",
        "config": {
            "type": "over-time",
            "series": [
                {
                    "source_type": "screen-answer",
                    "source_id": "rYyxDbFiFN",
                    "name": "Weight over time"
                },
                {
                    "source_type": "screen-answer",
                    "source_id": "UXWQ0hIAhi",
                    "name": "Height over time"
                }
            ]
        }
    }

### Sample Response

    {
        "id": "Yjp8CqRE9A"
    }

## Get Latest Answers

Authentication required (provider or admin only). To be used by provider website.

### Query

    GET /screen-answers?screen=*screen_id*&client=*client_id*

### Sample Response

    {
        "UXWQ0hIAhi": {
            "createdAt": "2017-08-21T20:53:29.125Z",
            "answer": {
                "type": "measurement",
                "units": "m",
                "value": 1.79
            }
        },
        "rYyxDbFiFN": {
            "createdAt": "2017-08-22T20:38:32.259Z",
            "answer": {
                "type": "measurement",
                "units": "kg",
                "value": 85.9
            }
        }
    }

## Post Screen Answer

Authentication required (provider or admin only). To be used by provider website.

### Query

    POST /screen-answers

### Sample Request Body

    {
        "question": "UXWQ0hIAhi",
        "answer": {
            "type": "measurement",
            "units": "m",
            "value": 1.8
        },
        "client": "VIKtDWRRbS"
    }

### Sample Response

    {
        "id": "7CXGFpB0nv"
    }

## Retrieve Goals

Authentication required.

### Query

    GET /goals

### Sample Response

Would respond with a number of JSON objects structured like this

    [
        {
            "id": "rt4qePLv6D",
            "goal": "Take a 10 minute run",
            "createdAt": "08/12/2017",
            "issuer": "Physician",
            "completed": "false",
            "accepted": "true"
        }
    ]

## New Goal

Authentication required.

### Query

    POST /goals

### Sample Request Body

`client` field is required if request is by provider/admin.

    {
        "type": "new",
        "goal": "Take a 10 minute run",
        "client": "VIKtDWRRbS"
    }

### Sample Response

    {
        "id": "rt4qePLv6D"
    }

## Update Existing Goal

Authentication required.

### Query

    POST /goals

### Sample Request Body

    {
        "type": "update",
        "id": "rt4qePLv6D",
        "updates": {
            "accepted": true
        }
    }

### Sample Response

    {
        "success": true
    }

## Screen Question Lookup

Authentication required (provider and admin only). To be used by provider website query builder to determine the screen that a question belongs to.

### Query

    GET /screen-question-lookup?id=*question_id*

### Sample Response

    {
        "screen": "qmwM6V2L3Z"
    }

## Calculated Attributes List

Authentication required (provider and admin only). To be used by provider website query builder to show list of available calculated attributes.

### Query

    GET /calculated-attributes-list

### Sample Response

    [
        {
            "id": "pguz0ZeqLT",
            "name": "Body Mass Index"
        }
    ]

## Retrieve Surveys

Authentication required (patient only). To be used by mobile app.

### Query

    GET /surveys

### Sample Request

Would reply with a number of JSON objects structured like this

    [
        {
            "order": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],            // (this is an array of numbers based on the position uploaded)
            "createdAt": "2017-08-25T20:09:38.344Z"
        }
    ]

## Push Surveys

Authentication required (patient only). To be used by mobile app.

### Query

    POST /Surveys

### Sample Request

    {
        "order": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]                 // (this is an array of numbers based on the position uploaded)
    }


### Sample Response

    {
        "success": "true"
    }

## Push Shake Data

Authentication required (patient only). To be used by mobile app.

### Query

    POST /shake

### Sample Request

    {
        "xHigh": 343.83,
        "xLow": -221,
        "yHigh": 125.82,
        "yLow": -200,
        "zHigh": 220,
        "zLow": -123.67,
        "shakeValue": 6
    }

### Sample Response

    {
        "success": "true"
    }

## Pull Shake Data

Authentication required (patient only). To be used by mobile app.

### Query

    GET /shake

### Sample Response

A number of JSON objects like this

    [
        {
            "xHigh": 343.83,
            "xLow": -221,
            "yHigh": 125.82,
            "yLow": -200,
            "zHigh": 220,
            "zLow": -123.67,
            "shakeValue": 6,
            "createdAt": "2017-08-25T20:09:38.344Z"
        }
    ]

## Push Mood

Authentication required (patient only). To be used by mobile app.

### Query

    POST /mood

### Sample Request Body

    {
        "value": 5
    }

### Sample Response

    {
        "success": true
    }

## Pull Mood

Authentication required (patient only). To be used by mobile app.

### Query

    GET /mood

### Sample Response

    [
        {
            "value": 5,
            "createdAt": "2017-08-30T17:30:01.952Z"
        }
    ]
