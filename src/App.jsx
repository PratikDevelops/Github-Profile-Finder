import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light'); 

  const fetchProfileAndRepos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProfile(null);
    setRepos([]);

    try {
      const profileResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!profileResponse.ok) {
        throw new Error('User not found');
      }
      const profileData = await profileResponse.json();
      setProfile(profileData);

      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!reposResponse.ok) {
        throw new Error('Error fetching repositories');
      }
      const reposData = await reposResponse.json();
      setRepos(reposData);
    } catch (error) {
      setError('User not found. Please enter a valid GitHub username.');
    } finally {
      setLoading(false);
    }
  };

 
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`container ${theme}`}>
      <h1>GitHub Profile Finder</h1>

     
      <button className="theme-toggler" onClick={toggleTheme}>
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>

      <form onSubmit={fetchProfileAndRepos}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="spinner">Loading...</div>}
      {error && <p className="error">{error}</p>}

      {profile && (
        <div className="profile">
          <img src={profile.avatar_url} alt="avatar" className="avatar" />
          <h2>{profile.name || profile.login}</h2>
          <p>{profile.bio}</p>
          <p><strong>Location:</strong> {profile.location || 'Not available'}</p>
          <p><strong>Followers:</strong> {profile.followers}</p>
          <p><strong>Following:</strong> {profile.following}</p>
          <p><strong>Public Repos:</strong> {profile.public_repos}</p>
          <p><strong>Joined GitHub:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer">View Profile on GitHub</a>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repos">
          <h3>Public Repositories:</h3>
          <div className="repos-container">
            {repos.map((repo) => (
              <div className="repo-card" key={repo.id}>
                <h4 className="repo-name">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h4>
                <p className="repo-description">{repo.description || 'No description available'}</p>
                <p><strong>Language:</strong> {repo.language || 'Not specified'}</p>
                <p><strong>Stars:</strong> {repo.stargazers_count}</p>
                <p><strong>Forks:</strong> {repo.forks_count}</p>
                <p><strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
