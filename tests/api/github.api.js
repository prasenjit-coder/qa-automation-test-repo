import axios from 'axios';

export class GitHubAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://api.github.com';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });
  }

  async createRepository(name, options = {}) {
    try {
      const response = await this.client.post('/user/repos', {
        name,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create repository: ${error.response?.data?.message || error.message}`);
    }
  }

  async getRepository(owner, repo) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get repository: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateRepository(owner, repo, options) {
    try {
      const response = await this.client.patch(`/repos/${owner}/${repo}`, options);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update repository: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteRepository(owner, repo) {
    try {
      await this.client.delete(`/repos/${owner}/${repo}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw new Error(`Failed to delete repository: ${error.response?.data?.message || error.message}`);
    }
  }

  async listRepositories(username) {
    try {
      const response = await this.client.get(`/users/${username}/repos`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to list repositories: ${error.response?.data?.message || error.message}`);
    }
  }

  async createOrUpdateFile(owner, repo, path, content, message, sha = null) {
    try {
      const encodedContent = Buffer.from(content).toString('base64');
      const data = {
        message,
        content: encodedContent
      };
      if (sha) {
        data.sha = sha;
      }
      const response = await this.client.put(`/repos/${owner}/${repo}/contents/${path}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create/update file: ${error.response?.data?.message || error.message}`);
    }
  }

  async getFileContent(owner, repo, path) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/contents/${path}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get file content: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteFile(owner, repo, path, message, sha) {
    try {
      await this.client.delete(`/repos/${owner}/${repo}/contents/${path}`, {
        data: { message, sha }
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.response?.data?.message || error.message}`);
    }
  }

  async testResourceNotFound(owner, repo) {
    try {
      await this.client.get(`/repos/${owner}/${repo}`);
      return false;
    } catch (error) {
      return error.response?.status === 404;
    }
  }

  async testUnprocessableEntity(data) {
    try {
      await this.client.post('/user/repos', data);
      return false;
    } catch (error) {
      return error.response?.status === 422;
    }
  }

  async checkRateLimit() {
    try {
      const response = await this.client.get('/rate_limit');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check rate limit: ${error.response?.data?.message || error.message}`);
    }
  }

  async testInvalidToken() {
    try {
      const response = await this.client.get('/user');
      return { success: true, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      };
    }
  }
}
