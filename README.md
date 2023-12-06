# Assignment 3 (A3)

Now that we have our basic workout app working (A2) we are going to build out more features. Our starting point is your A2 code, so copy it into this repo (not the `.github` folder). ***The goal is to have a production ready workout app by the end of A3.*** Some of the features below are harder to implement than others. I recommend staring with the "Persisting state" and then doing the rest in any order.

## List of new features 

### Persisting state (Only Graduate)

Our workout app has a pretty big problem, when the user refreshes the page we lose all configuration. We want to solve this by persisting state, so that if the page is reloaded or closed accidentally, we can restore the user to the same state. I like to think of it as we have two separate chunks of state we want to store. The first is the initial timer configuration and the second is the running state. For the timer configuration state we can store this in the URL. As the user changes the configuration, we want to update the url. We should only do this when the user has added/removed/moved the timer from configuration. We recommend that you don't update URL every time they enter an input, but instead have some sort of save button that would sync URL. Once the user has configured the workout and started the workout, we want to store the running state in local storage. We don't want to be doing a million writes to local storage, so I recommend that you think about how we can accomplish this with fewer writes. It doesn't have to restore to the latest millisecond, but it should be somewhat close (5-10 seconds) to what the workout was at after a reload/refresh of the page.

### Edit a timer

After the workout has been configured and the user is on the main run workout screen, add functionality that allows the user to edit any of the timer configurations (remember to update URL).

### Change the order of a timer in configured workout

After the workout has been configured and the user is on the main run workout screen, the user can move any timer to a different position in the queue. This can be done a couple of ways. You are welcome to use a drag and drop third party package or come up with something on your own (remember to update URL). The user should also be able to remove a timer from the queue.

### Display total time 

After the workout has been configured and the user is on the main run workout screen, display the total workout time and count down from total time to zero (when workout is complete) once the workout has been started.

### Add description to each timer

Add a description field to each time that the user can add when creating the timer and when editing the timer. It should be displayed while the timer is running.

### Wrap app using react-error-boundary

If for any reason your workout app errors out, then you should handle this and present the user with an error message. `react-error-boundary` package has a nice implementation of react "error boundaries" that you can use to handle this scenario.

### BONUS: Workout history 

We want to create a new screen that displays a list of previous workouts (create a new route and link to the history page in the navbar). ***Once a workout has been completed, add this workout to the history and save it to local storage***. On the new history screen display all workouts completed and for each workout you should display some summary of all timers run and what the durations/rounds for each timer was.


## Deliverables
- Complete all features listed above
- As always deploy your app 
## Grading Rubric
We will be grading based on the features listed above and overall code quality
- Persisting state (20pt)
- Workout history (20pt)
- Edit a timer (10pt)
- Change the order of a timer in configured workout (10pt)
- Display total time (10pt)
- Add description to each timer (5pt)
- Wrap app using react-error-boundary (5pt)
- DRY and overall code quality (20pt)

### Deployment Instructions (GH actions)

[Deployment instructions](https://github.com/prof-tejera/react-deployment-code#github-actions)

## Bonus

- Declare proptypes on all components you have created (5pt)
