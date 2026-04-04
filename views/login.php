<div id="loginPage">
        <div class="login-container">
            <div class="login-header">
                <div class="login-logo-circle" id="loginLogo">📦</div>
                <h1 id="loginTitle">StockFlow</h1>
                <p>Login to your account</p>
            </div>
            <div class="login-form">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" id="username" placeholder="Enter username">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <div class="password-field">
                        <input type="password" id="password" placeholder="Enter password">
                        <span class="toggle-password" onclick="togglePassword('password')">👁️</span>
                    </div>
                </div>
                <button class="login-btn" onclick="login()">Login</button>
            </div>
        </div>
    </div>