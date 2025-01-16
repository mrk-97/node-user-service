// src/models/user.model.js
class User {
    constructor(connection) {
      this.connection = connection;
    }
  
    async findAll() {
      const [rows] = await this.connection.query('SELECT * FROM users');
      return rows;
    }
  
    async findById(id) {
      const [rows] = await this.connection.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    }
  
    async create(userData) {
      const { username, email, password } = userData;
      const [result] = await this.connection.query(
        'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [username, email, password]
      );
      return result.insertId;
    }
  
    async update(id, userData) {
      const { username, email } = userData;
      const [result] = await this.connection.query(
        'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?',
        [username, email, id]
      );
      return result.affectedRows > 0;
    }
  
    async delete(id) {
      const [result] = await this.connection.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    }
  }
  
  module.exports = User;