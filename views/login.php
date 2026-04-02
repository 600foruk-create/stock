<div id="loginPage">
        <div class="login-container">
            <div class="login-header">
                <h1 id="loginTitle">📦 StockFlow</h1>
                <p>Login to your account</p>
            </div>
            <div class="login-form">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="username" placeholder="Enter username" value="admin">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <div class="password-field">
                        <input type="password" id="password" placeholder="Enter password" value="admin123">
                        <span class="toggle-password" onclick="togglePassword('password')">👁️</span>
                    </div>
                </div>
                <button class="login-btn" onclick="login()">Login</button>
                <div class="login-footer">
                    <p>Default: admin / admin123</p>
                </div>
            </div>
        </div>
    </div>