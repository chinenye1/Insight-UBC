Please edit this template and commit to the master branch for your user stories submission.   
Make sure to follow the *Role, Goal, Benefit* framework for the user stories and the *Given/When/Then* framework for the Definitions of Done! You can also refer to the examples DoDs in [C3 spec](https://sites.google.com/view/ubc-cpsc310-21w2-intro-to-se/project/checkpoint-3).

## User Story 1
As the student, I want to be able to search for a course, so that I can see the historical average of that course.

#### Definitions of Done(s)
Scenario 1: Valid course department and course id 
Given: The user is on the home screen
When: User inputs valid course department and course id (as specified on the home screen)
Then: The user remains on the home screen and the application will display a selected summary of all the information in the system related to that course, including the historical average.

#### Definitions of Done(s)
Scenario 2: Invalid (department and course id)
Given: The user is on the home screen
When: User inputs invalid course department and course id (as specified on the home screen)
Then: The user remains on the home screen and the application will display a message indicating an invalid Input

## User Story 2
As the Dean, I want to be able to search for a department, so that I can see how many fails have occurred in that department.

#### Definitions of Done(s)
Scenario 1: Valid course department input
Given: The user is on the home screen 
When: User inputs valid course department (as specified on the home screen)
Then: The user remains on the home screen and the application will display a selected summary of all the information in the system related to that department, including the sum of all the fails that have occurred in that course department.


#### Definitions of Done(s)
Scenario 2: Invalid course department input
Given: The user is on the home screen
When: User inputs invalid course department (as specified on the home screen)
Then: The user remains on the home screen and the application will display a message indicating an invalid Input

## Others
You may provide any additional user stories + DoDs in this section for general TA feedback.  
Note: These will not be graded.
