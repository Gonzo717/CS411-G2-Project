# CS411-G2-Project

Repo for CS 411 Software Engineering Project
Members: Gonzalo Rosales, Benjamin Sui, Jonathan Luo, Richard Cho

## Project Ideas

### Idea #1 Dating Analysis:
The application design works as a date matching algorithm. It will analyze profiles in order to match users. Each user profile will include a number of photos, a self summary, and answers to various questions. The application will analyze the sentiment of the users’ texts, utilizing Watson text analysis to retrieve data describing the mood of the users. Additionally, Google’s image classifier will return data, words describing the contents of the photo. From these API’s, our program will build matches from the user profiles in a dating setting.

### Idea #2: Movie Recommendations: 
This webapp will recommend movies to users based on their spotify “On Repeat” playlist, which tracks their most played tracks. First, the application will require users to log in using their Spotify account. Then, using Spotify’s audio analysis API, we will retrieve the tracks from their playlists and collect data like the artist, genre, and pitch. The lyrics to these tracks will then be obtained using Genius’ lyrics API and sent to IBM Watson for sentiment analysis. The sentiment will then be used to suggest movies to users using The Movie DB Api. 
