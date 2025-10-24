// API Configuration
        // --- BẮT BUỘC: Cấu hình API cho Gemini ---
        const API_KEYS = [
            "AIzaSyDRCqGaFgCtAe9ZPvtlEAThfohqDFqziFM", // API Key cho Gemini
            "AIzaSyC4mfNp96u609JSvT8J8DwK8YukdL5ri2w",
            "AIzaSyBOVQEzrRoAxBM4kX1Hj8PVV_EQokrCf1o"
        ];
        let currentApiKeyIndex = 0;
        const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        
        // --- BẮT BUỘC: Cấu hình cho Google Custom Search API (Cách cũ) ---
        const CUSTOM_SEARCH_API_KEY = "AIzaSyDo2Uqcdjfj3aLi6ZsIAu08vZ476yfn-ws"; // API Key cho Custom Search API
        const CUSTOM_SEARCH_ENGINE_ID = "11bff95e8e1f543a5"; // Search Engine ID (cx)
        
        // User Access Configuration
        const ADMIN_PASS_KEY = "Admin-PassKeyV2.ee";
        const VALID_PLUS_KEY_PREFIX = "Plus-Alpha-Beta.";
        const VALID_PLUS_KEY_NUMBERS = ["12345", "54321", "98765", "11223", "33445"]; // Example valid numbers
        const USAGE_LIMITS = {
            normal: 20, // Daily request limit for normal users
            plus: 100,  // Daily request limit for plus users (first 2 days)
        };

        // Initialize PDF.js
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        document.addEventListener('DOMContentLoaded', function() {
            const messageInput = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendBtn');
            const chatContainer = document.getElementById('chatContainer');
            const emptyState = document.getElementById('emptyState');
            const newChatBtn = document.getElementById('newChatBtn');
            const typingIndicator = document.getElementById('typingIndicator');
            const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
            const menuBtn = document.getElementById('menuBtn');
            const sidebar = document.getElementById('sidebar');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const sendSpinner = document.getElementById('sendSpinner');
            const sendIcon = document.getElementById('sendIcon');
            const fileUpload = document.getElementById('fileUpload');
            const themeToggleBtn = document.getElementById('themeToggleBtn');
            const hljsLightTheme = document.getElementById('hljs-light-theme');
            const hljsDarkTheme = document.getElementById('hljs-dark-theme');
            const fileStatusIndicator = document.getElementById('fileStatusIndicator');
            const fileStatusText = document.getElementById('fileStatusText');
            const deepThinkBtn = document.getElementById('deepThinkBtn');
            const deepThinkMenu = document.getElementById('deepThinkMenu');
            const internetSearchBtn = document.getElementById('internetSearchBtn');
            const researchBtn = document.getElementById('researchBtn');
            const researchModalOverlay = document.getElementById('researchModalOverlay');
            const researchForm = document.getElementById('researchForm');
            const cancelResearchBtn = document.getElementById('cancelResearchBtn');
            const researchTopicInput = document.getElementById('researchTopicInput');
            const chatHistoryContainer = document.getElementById('chatHistory');
            const confirmationModalOverlay = document.getElementById('confirmationModalOverlay');
            const confirmationModalTitle = document.getElementById('confirmationModalTitle');
            const confirmationModalMessage = document.getElementById('confirmationModalMessage');
            const cancelConfirmationBtn = document.getElementById('cancelConfirmationBtn');
            const confirmActionBtn = document.getElementById('confirmActionBtn');
            const alertModalOverlay = document.getElementById('alertModalOverlay');
            const alertModalTitle = document.getElementById('alertModalTitle');
            const alertModalMessage = document.getElementById('alertModalMessage');
            const alertModalOkBtn = document.getElementById('alertModalOkBtn');
            const upgradeBtn = document.getElementById('upgradeBtn');
            const passkeyModalOverlay = document.getElementById('passkeyModalOverlay');
            const passkeyForm = document.getElementById('passkeyForm');
            const cancelPasskeyBtn = document.getElementById('cancelPasskeyBtn');
            const passkeyInput = document.getElementById('passkeyInput');
            const intelligenceControl = document.getElementById('intelligenceControl');
            const intelligenceBtn = document.getElementById('intelligenceBtn');
            const intelligenceMenu = document.getElementById('intelligenceMenu');
            const intelligenceSlider = document.getElementById('intelligenceSlider');
            const intelligenceValue = document.getElementById('intelligenceValue');
            const resultsSidebar = document.getElementById('resultsSidebar');
            const closeResultsBtn = document.getElementById('closeResultsBtn');
            const resultsSidebarContent = document.getElementById('resultsSidebarContent');
            const previewSidebar = document.getElementById('previewSidebar');
            const closePreviewBtn = document.getElementById('closePreviewBtn');
            const previewSidebarTitle = document.getElementById('previewSidebarTitle');
            const previewSidebarFrame = document.getElementById('previewSidebarFrame');
            const toastNotification = document.getElementById('toastNotification');
            const toastMessage = document.getElementById('toastMessage');
            const previewResizeHandle = document.getElementById('previewResizeHandle');

            const mainContent = document.querySelector('.main-content');
            // State variables
            let conversations = [];
            let currentConversationId = null;
            let chatHistory = [];
            let uploadedFile = null;
            let deepThinkMode = 'off'; // 'off', 'normal', 'deeper', 'deepest'
            let isInternetSearchMode = false;
            let deepThinkTimerInterval = null;
            let userProfile = {};
            let allSearchResults = [];
            let aiIntelligence = 50;
            let isRenamingByAI = false; // Flag to prevent sending messages while AI is renaming
            let isAiResponding = false;
            let currentAbortController = null;

            // --- Drag and Drop Logic ---
            const dragDropOverlay = document.getElementById('dragDropOverlay');

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                mainContent.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                mainContent.addEventListener(eventName, () => {
                    dragDropOverlay.classList.add('visible');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                mainContent.addEventListener(eventName, () => {
                    dragDropOverlay.classList.remove('visible');
                }, false);
            });

            mainContent.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0) {
                    // Giả lập sự kiện 'change' trên input file
                    // để tái sử dụng logic xử lý file đã có
                    fileUpload.files = files;
                    const changeEvent = new Event('change', { bubbles: true });
                    fileUpload.dispatchEvent(changeEvent);
                }
            }, false);

            // --- Preview Sidebar Resizing Logic ---
            let isResizing = false;
            let startX = 0;
            let startWidth = 0;

            previewResizeHandle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startWidth = parseInt(document.defaultView.getComputedStyle(previewSidebar).width, 10);
                previewSidebar.classList.add('resizing');
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', function(e) {
                if (!isResizing) return;
                const dx = e.clientX - startX;
                const newWidth = startWidth - dx;
                previewSidebar.style.width = `${newWidth}px`;
            });

            document.addEventListener('mouseup', function() {
                if (isResizing) {
                    isResizing = false;
                    previewSidebar.classList.remove('resizing');
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });

            
            // Toggle sidebar on mobile
            menuBtn.addEventListener('click', function() {
                sidebar.classList.add('active');
                sidebarOverlay.classList.add('active');
            });
            
            sidebarOverlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });

            closeResultsBtn.addEventListener('click', () => {
                resultsSidebar.classList.remove('visible');
            });

            closePreviewBtn.addEventListener('click', () => {
                previewSidebar.classList.remove('visible');
                previewSidebarFrame.srcdoc = ''; // Clear content to save memory
                document.querySelectorAll('.preview-btn.active').forEach(b => b.classList.remove('active'));
            });

            // --- User Profile & Access Control ---
            function loadUserProfile() {
                const savedProfile = localStorage.getItem('starx_user_profile');
                const defaultProfile = {
                    tier: 'normal', // normal, plus, admin
                    requestsToday: 0,
                    lastRequestDate: getTodaysDateString(),
                    plusKey: null,
                    plusActivationDate: null,
                    plusKeyExpiry: null,
                };
                userProfile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
                
                // Check for Plus key expiration on load
                if (userProfile.tier === 'plus' && userProfile.plusKeyExpiry && new Date() > new Date(userProfile.plusKeyExpiry)) {
                    showAlertModal('Gói Plus đã hết hạn', 'Gói Plus của bạn đã hết hạn. Tài khoản của bạn đã được chuyển về gói thường.');
                    userProfile.tier = 'normal';
                    userProfile.plusKey = null;
                    userProfile.plusActivationDate = null;
                    userProfile.plusKeyExpiry = null;
                    saveUserProfile();
                }

                updateUIForUserTier();
            }

            function saveUserProfile() {
                localStorage.setItem('starx_user_profile', JSON.stringify(userProfile));
            }

            function getTodaysDateString() {
                return new Date().toISOString().split('T')[0];
            }

            function checkUsageLimits() {
                if (userProfile.tier === 'admin') {
                    return false; // No limits for admin
                }

                const today = getTodaysDateString();
                if (userProfile.lastRequestDate !== today) {
                    userProfile.requestsToday = 0;
                    userProfile.lastRequestDate = today;
                    saveUserProfile();
                }

                let limit = USAGE_LIMITS.normal;
                let limitType = 'thường';

                if (userProfile.tier === 'plus') {
                    // Check if within 2-day high-usage window
                    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
                    const activationDate = new Date(userProfile.plusActivationDate);
                    if (new Date() < new Date(activationDate.getTime() + twoDaysInMillis)) {
                        limit = USAGE_LIMITS.plus;
                        limitType = 'Plus (ưu đãi)';
                    } else {
                        limitType = 'Plus';
                    }
                }

                if (userProfile.requestsToday >= limit) {
                    showAlertModal('Đã đạt giới hạn sử dụng', `Bạn đã đạt giới hạn ${limit} yêu cầu cho gói ${limitType} trong ngày hôm nay. Vui lòng quay lại sau hoặc nâng cấp tài khoản.`);
                    return true; // User is blocked
                }

                return false; // User is not blocked
            }

            function handlePasskey(key) {
                // Admin Key
                if (key === ADMIN_PASS_KEY) {
                    userProfile.tier = 'admin';
                    saveUserProfile();
                    updateUIForUserTier();
                    showAlertModal('Chào mừng Admin!', 'Bạn đã đăng nhập với quyền quản trị viên. Tất cả các giới hạn đã được gỡ bỏ.');
                    return;
                }

                // Plus Key
                if (key.startsWith(VALID_PLUS_KEY_PREFIX)) {
                    const keyNumber = key.substring(VALID_PLUS_KEY_PREFIX.length);
                    if (VALID_PLUS_KEY_NUMBERS.includes(keyNumber)) {
                        const usedKeys = JSON.parse(localStorage.getItem('starx_used_plus_keys') || '{}');
                        if (usedKeys[key] && new Date() > new Date(usedKeys[key])) {
                            showAlertModal('Lỗi', 'Pass-Key này đã được sử dụng và đã hết hạn.');
                            return;
                        }

                        userProfile.tier = 'plus';
                        userProfile.requestsToday = 0;
                        userProfile.plusKey = key;
                        userProfile.plusActivationDate = new Date().toISOString();
                        const expiryDate = new Date();
                        expiryDate.setMonth(expiryDate.getMonth() + 1);
                        userProfile.plusKeyExpiry = expiryDate.toISOString();
                        
                        usedKeys[key] = userProfile.plusKeyExpiry;
                        localStorage.setItem('starx_used_plus_keys', JSON.stringify(usedKeys));

                        saveUserProfile();
                        updateUIForUserTier();
                        showAlertModal('Nâng cấp thành công!', 'Tài khoản của bạn đã được nâng cấp lên gói Plus. Bạn có 2 ngày sử dụng với giới hạn cao hơn và AI thông minh hơn. Gói sẽ hết hạn sau 1 tháng.');
                        return;
                    }
                }
                showAlertModal('Lỗi', 'Pass-Key không hợp lệ. Vui lòng thử lại.');
            }

            function updateUIForUserTier() {
                if (userProfile.tier === 'admin') {
                    intelligenceControl.style.display = 'block';
                    upgradeBtn.style.display = 'none';
                } else {
                    intelligenceControl.style.display = 'none';
                    upgradeBtn.style.display = 'flex';
                }
            }

            // Deep Think dropdown handler
            deepThinkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deepThinkMenu.classList.toggle('visible');
            });

            document.querySelectorAll('.deep-think-option').forEach(option => {
                option.addEventListener('click', () => {
                    const selectedMode = option.dataset.mode;
                    document.querySelectorAll('.deep-think-option').forEach(opt => opt.classList.remove('active'));

                    if (deepThinkMode === selectedMode) {
                        // If clicking the active mode, turn it off
                        deepThinkMode = 'off';
                        deepThinkBtn.classList.remove('active');
                    } else {
                        // Otherwise, switch to the new mode
                        deepThinkMode = selectedMode;
                        option.classList.add('active');
                        deepThinkBtn.classList.add('active');
                    }
                    deepThinkMenu.classList.remove('visible');
                });
            });

            // Intelligence slider handler
            intelligenceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                intelligenceMenu.classList.toggle('visible');
            });

            intelligenceSlider.addEventListener('input', (e) => {
                aiIntelligence = parseInt(e.target.value, 10);
                intelligenceValue.textContent = aiIntelligence;
            });

            document.addEventListener('click', (e) => {
                if (deepThinkMenu.classList.contains('visible') && !deepThinkBtn.contains(e.target) && !deepThinkMenu.contains(e.target)) {
                    deepThinkMenu.classList.remove('visible');
                }
                if (intelligenceMenu.classList.contains('visible') && !intelligenceBtn.contains(e.target) && !intelligenceMenu.contains(e.target)) {
                    intelligenceMenu.classList.remove('visible');
                }
            });

            // Upgrade button handler
            upgradeBtn.addEventListener('click', () => {
                passkeyModalOverlay.classList.add('visible');
                passkeyInput.focus();
            });

            function closePasskeyModal() {
                passkeyModalOverlay.classList.remove('visible');
                passkeyInput.value = '';
            }

            cancelPasskeyBtn.addEventListener('click', closePasskeyModal);
            passkeyModalOverlay.addEventListener('click', (e) => {
                if (e.target === passkeyModalOverlay) {
                    closePasskeyModal();
                }
            });

            // Event delegation for panel toggle buttons
            chatContainer.addEventListener('click', function(e) {
                const toggleBtn = e.target.closest('.panel-toggle-btn');
                if (toggleBtn) {
                    const panelContent = toggleBtn.closest('.ai-panel-content');
                    const panelBody = panelContent.querySelector('.panel-body');
                    if (panelBody) {
                        toggleBtn.classList.toggle('collapsed');
                        panelBody.classList.toggle('collapsed');
                    }
                }
            });

            // Event delegation for chat history actions (rename, delete)
            chatHistoryContainer.addEventListener('click', function(e) {
                const deleteBtn = e.target.closest('.delete-btn');
                const renameBtn = e.target.closest('.rename-btn');

                if (deleteBtn) {
                    e.stopPropagation();
                    const chatItem = deleteBtn.closest('.chat-item');
                    const convoId = chatItem.dataset.id;
                    handleDeleteConversation(convoId);
                }

                if (renameBtn) {
                    e.stopPropagation();
                    const chatItem = renameBtn.closest('.chat-item');
                    const convoId = chatItem.dataset.id;
                    handleRenameConversation(convoId, chatItem);
                }

                const aiRenameBtn = e.target.closest('.ai-rename-btn');
                if (aiRenameBtn) {
                    e.stopPropagation();
                    const chatItem = aiRenameBtn.closest('.chat-item');
                    const convoId = chatItem.dataset.id;
                    handleRenameByAI(convoId, chatItem);
                }
            });

            // Toggle Internet Search mode
            internetSearchBtn.addEventListener('click', () => {
                isInternetSearchMode = !isInternetSearchMode;
                internetSearchBtn.classList.toggle('active', isInternetSearchMode);
            });

            // Handle In-depth Research button
            researchBtn.addEventListener('click', () => {
                // Tắt các chế độ khác khi bắt đầu nghiên cứu
                isInternetSearchMode = false;
                internetSearchBtn.classList.remove('active');
                deepThinkMode = 'off';
                deepThinkBtn.classList.remove('active');
                document.querySelectorAll('.deep-think-option').forEach(opt => opt.classList.remove('active'));

                researchModalOverlay.classList.add('visible');
                setTimeout(() => researchTopicInput.focus(), 100); // Focus input after transition
            });

            // Handle closing the research modal
            function closeResearchModal() {
                researchModalOverlay.classList.remove('visible');
            }

            cancelResearchBtn.addEventListener('click', closeResearchModal);

            researchModalOverlay.addEventListener('click', (e) => {
                if (e.target === researchModalOverlay) {
                    closeResearchModal();
                }
            });

            // --- Alert Modal Logic ---
            function showAlertModal(title, message) {
                alertModalTitle.textContent = title;
                alertModalMessage.textContent = message;
                alertModalOverlay.classList.add('visible');
            }

            function hideAlertModal() {
                alertModalOverlay.classList.remove('visible');
            }

            alertModalOkBtn.addEventListener('click', hideAlertModal);

            alertModalOverlay.addEventListener('click', (e) => {
                if (e.target === alertModalOverlay) {
                    hideAlertModal();
                }
            });

            // --- Message Actions (Like, Dislike, Regenerate) ---
            chatContainer.addEventListener('click', (e) => {
                const likeBtn = e.target.closest('.like-btn');
                const dislikeBtn = e.target.closest('.dislike-btn');
                const regenerateBtn = e.target.closest('.regenerate-btn');

                if (likeBtn) {
                    const messageDiv = likeBtn.closest('.message');
                    handleFeedback(messageDiv, 'liked');
                    likeBtn.classList.add('active');
                    dislikeBtn.classList.remove('active');
                    showToast("Cảm ơn bạn đã thích phản hồi, AI sẽ cố gắng phát huy hơn nữa");
                }

                if (dislikeBtn) {
                    const messageDiv = dislikeBtn.closest('.message');
                    handleFeedback(messageDiv, 'disliked');
                    dislikeBtn.classList.add('active');
                    likeBtn.classList.remove('active');
                    showToast("Cảm ơn bạn đã phản hồi, AI sẽ rút kinh nghiệm và cải thiện trong lần sau");
                }

                if (regenerateBtn) {
                    regenerateResponse();
                }
            });

            // --- Toast Notification Logic ---
            let toastTimeout;
            function showToast(message) {
                clearTimeout(toastTimeout);
                toastMessage.textContent = message;
                toastNotification.classList.add('show');

                toastTimeout = setTimeout(() => {
                    toastNotification.classList.remove('show');
                }, 3000); // Hide after 3 seconds
            }

            passkeyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const key = passkeyInput.value.trim();
            });

            // --- Confirmation Modal Logic ---
            let onConfirmCallback = null;

            function showConfirmationModal(title, message, confirmText, onConfirm) {
                confirmationModalTitle.textContent = title;
                confirmationModalMessage.textContent = message;
                confirmActionBtn.textContent = confirmText;

                // Style for destructive action
                confirmActionBtn.classList.remove('modal-btn-primary');
                confirmActionBtn.classList.add('modal-btn-danger');

                onConfirmCallback = onConfirm;
                confirmationModalOverlay.classList.add('visible');
            }

            function hideConfirmationModal() {
                confirmationModalOverlay.classList.remove('visible');
                onConfirmCallback = null;
            }

            cancelConfirmationBtn.addEventListener('click', hideConfirmationModal);

            confirmActionBtn.addEventListener('click', () => {
                if (typeof onConfirmCallback === 'function') {
                    onConfirmCallback();
                }
                hideConfirmationModal();
            });

            confirmationModalOverlay.addEventListener('click', (e) => {
                if (e.target === confirmationModalOverlay) {
                    hideConfirmationModal();
                }
            });

            document.addEventListener('keydown', (e) => { // Combined Escape key handler
                if (e.key === 'Escape') {
                    if (researchModalOverlay.classList.contains('visible')) {
                        closeResearchModal();
                    }
                    if (confirmationModalOverlay.classList.contains('visible')) {
                        hideConfirmationModal();
                    }
                    if (alertModalOverlay.classList.contains('visible')) {
                        hideAlertModal();
                    }
                }
            });

            // Handle passkey form submission
            passkeyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const key = passkeyInput.value.trim();
                if (!key) return;

                handlePasskey(key);
                closePasskeyModal();
            });


            // Handle research form submission
            researchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const topic = researchTopicInput.value.trim();
                if (topic) {
                    handleInDepthResearch(topic);
                    researchTopicInput.value = ''; // Clear input
                    closeResearchModal();
                }
            });
            
            // Auto-resize textarea
            messageInput.addEventListener('input', function() {
                const wasScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 1;

                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 300) + 'px';

                // If the user was at the bottom, keep them there after the input resizes
                if (wasScrolledToBottom) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                // Enable/disable send button based on input
                sendBtn.disabled = this.value.trim() === '' && !uploadedFile;
            });
            
            // Handle file upload
            fileUpload.addEventListener('change', async function(e) {
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    
                    fileStatusText.textContent = `Đang xử lý file: ${file.name}...`;
                    fileStatusIndicator.style.display = 'flex';
                    chatContainer.scrollTop = chatContainer.scrollHeight;

                    try {
                        const fileData = await readFile(file);
                        uploadedFile = {
                            file: file,
                            data: fileData
                        };
                        
                        // Cập nhật trạng thái với thông báo và xem trước
                        let statusHTML = `Đã sẵn sàng để gửi file: <strong>${file.name}</strong> (${formatFileSize(file.size)}).`;
                        if (fileData.type === 'image') {
                            statusHTML += `<br><img src="${fileData.url}" class="file-preview">`;
                        }
                        fileStatusText.innerHTML = statusHTML;
                        
                        sendBtn.disabled = false; // Bật nút gửi ngay khi file sẵn sàng
                        chatContainer.scrollTop = chatContainer.scrollHeight;

                    } catch (error) {
                        console.error('Error reading file:', error);
                        fileStatusText.innerHTML = `<span style="color: red;">Lỗi: ${error}. Vui lòng thử lại.</span>`;
                        // Ẩn sau vài giây
                        setTimeout(() => {
                            fileStatusIndicator.style.display = 'none';
                        }, 5000);
                        uploadedFile = null;
                        fileUpload.value = '';
                    }
                }
            });
            
            // Send message on Enter (without Shift on desktop, with Shift on mobile)
            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const isMobile = window.innerWidth <= 768;
                    if ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey)) {
                        e.preventDefault();
                        if (!sendBtn.disabled) {
                            sendMessage();
                        }
                    }
                }
            });
            
            // Send message on button click
            sendBtn.addEventListener('click', () => { // Combined listener
                if (isAiResponding && currentAbortController) {
                    // Disable the button briefly to prevent spamming the abort signal
                    sendBtn.disabled = true;
                    currentAbortController.abort();
                    // Re-enable is handled in the finally block, but we can set a timeout
                    // as a fallback in case the finally block doesn't run for some reason.
                    setTimeout(() => { if (isAiResponding) sendBtn.disabled = false; }, 1000);
                    // The rest of the cleanup is handled in the `finally` block of the API call function
                } else if (!isAiResponding) {
                    sendMessage();
                }
            });

            function handleFeedback(messageDiv, feedbackType) {
                // This is a placeholder for future implementation.
                // You would find the message in chatHistory and update its feedback property.
                console.log(`Feedback for message ${messageDiv.dataset.id}: ${feedbackType}`);
            }

            // Scroll to bottom button
            scrollToBottomBtn.addEventListener('click', function() {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });
            
            // Show/hide scroll to bottom button based on scroll position
            chatContainer.addEventListener('scroll', function() {
                const scrollThreshold = 100;
                const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < scrollThreshold;
                
                if (isNearBottom) {
                    scrollToBottomBtn.classList.remove('visible');
                } else {
                    scrollToBottomBtn.classList.add('visible');
                }
            });
            
            // Function to fetch with API key rotation and retry mechanism
            async function fetchWithApiKeyRotation(endpoint, payload, retriesPerKey = 2, backoff = 1000, signal = null) {
                const initialKeyIndex = currentApiKeyIndex;
                let totalAttempts = 0;
                const maxTotalAttempts = API_KEYS.length * (retriesPerKey + 1); // Maximum possible attempts
                let rateLimitFailures = 0; // Track how many keys fail due to rate limits in a cycle

                while (totalAttempts < maxTotalAttempts) {
                    const apiKey = API_KEYS[currentApiKeyIndex];
                    let keyFailedDueToRateLimit = false;
                    const url = `${endpoint}?key=${apiKey}`;
                    totalAttempts++;

                    for (let i = 0; i <= retriesPerKey; i++) {
                        try {
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload),
                                signal: signal
                            });

                            if (response.ok) {
                                return response; // Success!
                            }

                            if (response.status === 429) { // Rate limited
                                console.warn(`API key index ${currentApiKeyIndex} is rate-limited. Switching to next key.`);
                                keyFailedDueToRateLimit = true;
                                break; // Break inner loop to switch key
                            }
                            
                            if ([500, 502, 503, 504].includes(response.status)) {
                                if (i < retriesPerKey) {
                                    console.warn(`Server error ${response.status} on key index ${currentApiKeyIndex}. Retrying in ${backoff * (i + 1)}ms...`);
                                    await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
                                    continue; // Retry on same key
                                } else {
                                    console.error(`All retries failed for key index ${currentApiKeyIndex} with server error ${response.status}. Switching key.`);
                                    break; 
                                }
                            }

                            const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                            throw new Error(`Lỗi API (${response.status}): ${errorData.error?.message || response.statusText}`);

                        } catch (error) {
                            if (error.name === 'AbortError') {
                                throw error; // Re-throw abort error to be handled by the caller
                            }
                            if (error.message.startsWith('Lỗi API')) {
                                throw error; 
                            }
                             if (i < retriesPerKey) {
                                console.warn(`Network error on key index ${currentApiKeyIndex}. Retrying...`);
                                await new Promise(resolve => setTimeout(resolve, backoff * (i + 1)));
                                continue;
                            } else {
                                console.error(`All retries failed for key index ${currentApiKeyIndex} with network error. Switching key.`);
                                break;
                            }
                        }
                    }

                    if (keyFailedDueToRateLimit) {
                        rateLimitFailures++;
                    }

                    currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
                    // If we've completed a full cycle through all keys
                    if (currentApiKeyIndex === initialKeyIndex) {
                        if (rateLimitFailures === API_KEYS.length) {
                            // If ALL keys failed due to rate limits, it's a temporary rate-limit issue. Explain this to the user.
                            throw new Error("Tất cả API key đều bị giới hạn tần suất yêu cầu (rate-limited). Vui lòng chờ 1 phút rồi thử lại.");
                        }
                        // Otherwise, it's a general server/network issue across all keys.
                        throw new Error("Tất cả các máy chủ AI dường như đang gặp sự cố. Vui lòng thử lại sau ít phút.");
                    }
                }
                throw new Error("Không thể kết nối đến AI. Vui lòng thử lại sau.");
            }

            function mapIntelligenceToTemp(intelligence) {
                // Maps 0-100 to a temperature range, e.g., 0.1 to 1.5
                // 0 -> 0.1 (more deterministic), 50 -> 0.9 (balanced), 100 -> 1.5 (creative)
                return 0.1 + (intelligence / 100) * 1.4;
            }

            async function fetchWithRetry(url, options, retries = 3, initialBackoff = 1000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await fetch(url, options);
                        if (response.ok) {
                            return response;
                        }
                        if ([500, 502, 503, 504].includes(response.status)) {
                            throw new Error(`Server error: ${response.status}`);
                        }
                        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
                        throw new Error(`Lỗi API (${response.status}): ${errorData.error?.message || response.statusText}`);

                    } catch (error) {
                        if (i === retries - 1) {
                            if (error.message && error.message.includes('429')) {
                                throw new Error("Bạn đã đạt giới hạn sử dụng AI. Vui lòng quay lại sau.");
                            }
                            throw new Error("AI không thể phản hồi lúc này. Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút.");
                        }
                        await new Promise(resolve => setTimeout(resolve, initialBackoff * (i + 1)));
                    }
                }
            }

            function handleApiError(error, panel = null) {
                console.error('API Error:', error);
                if (panel) panel.style.display = 'none'; // Hide the "thinking" panel if it exists

                // Check for specific, user-facing errors that should be modals
                const rateLimitMessage = "Bạn đã đạt giới hạn sử dụng AI. Vui lòng quay lại sau.";
                if (error.name === 'AbortError') {
                    addMessage('ai', `*Đã dừng tạo phản hồi.*`);
                    return;
                }
                const connectionErrorMessage = "AI không thể phản hồi lúc này. Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút.";

                if (error.message === rateLimitMessage) {
                    showAlertModal("Lỗi Giới Hạn", error.message);
                } else if (error.message === connectionErrorMessage) {
                    showAlertModal("Lỗi Kết Nối", error.message);
                } else {
                    // For other errors, display them in the chat window
                    addMessage('ai', `Xin lỗi, đã có lỗi xảy ra. ${error.message}`);
                }
            }

            async function fetchAndParseUrl(url, signal) {
                // Sử dụng một CORS proxy công khai để lấy nội dung trang web.
                // LƯU Ý: Proxy công khai không nên được sử dụng trong môi trường sản xuất thực tế.
                // Hãy xem xét việc tự host một proxy riêng để đảm bảo độ ổn định và bảo mật.
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                try {
                    const response = await fetch(proxyUrl, { method: 'GET', headers: { 'Accept': 'text/html' }, signal });
                    if (!response.ok) {
                        throw new Error(`Proxy fetch failed with status: ${response.status}`);
                    }
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // Loại bỏ các thẻ không chứa nội dung chính
                    doc.querySelectorAll('script, style, nav, footer, header, aside, form, noscript').forEach(el => el.remove());

                    // Lấy và làm sạch văn bản
                    let text = doc.body.textContent || "";
                    text = text.replace(/\s\s+/g, ' ').trim(); // Thay thế nhiều khoảng trắng bằng một

                    return text.substring(0, 4000); // Giới hạn độ dài để không làm quá tải context
                } catch (error) {
                    console.error(`Error fetching or parsing URL ${url}:`, error);
                    return `[Lỗi: Không thể truy cập hoặc phân tích nội dung từ trang web này.]`;
                }
            }

            function setInputControlsState(disabled) {
                messageInput.disabled = disabled;
                
                const buttons = [fileUpload.closest('label'), deepThinkBtn, internetSearchBtn, researchBtn, intelligenceBtn];
                buttons.forEach(btn => {
                    if (btn) {
                        btn.classList.toggle('control-disabled', disabled);
                    }
                });

                if (disabled) {
                    messageInput.placeholder = "AI đang phản hồi, vui lòng chờ...";
                } else {
                    messageInput.placeholder = "Nhập tin nhắn của bạn...";
                }

                if (isAiResponding) {
                    messageInput.placeholder = "AI đang phản hồi, vui lòng chờ...";
                    messageInput.placeholder = "Nhập tin nhắn của bạn...";
                }
            }

            async function getAiChatTitle(conversationHistory) {
                try {
                    const prompt = `Dựa trên lịch sử cuộc trò chuyện sau, hãy tạo một tiêu đề ngắn gọn (tối đa 5 từ) bằng tiếng Việt để tóm tắt nội dung chính. Chỉ trả về tiêu đề, không có bất kỳ lời giải thích hay dấu ngoặc kép nào.\n\nLỊCH SỬ:\n${conversationHistory.map(msg => `${msg.role === 'user' ? 'Người dùng' : 'AI'}: ${msg.parts.map(p => p.text).join(' ')}`).slice(0, 4).join('\n')}`;

                    const payload = {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.5, maxOutputTokens: 60 }
                    };

                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, payload);
                    const data = await response.json();
                    let title = data.candidates?.[0]?.content?.parts?.[0]?.text.trim().replace(/["']/g, '');
                    return title || "Cuộc trò chuyện mới";

                } catch (error) {
                    console.warn("AI title generation failed, using default.", error);
                    return "Cuộc trò chuyện mới";
                }
            }

            function manageCurrentConversation(userMessage) {
                let currentConvo = conversations.find(c => c.id === currentConversationId);

                if (!currentConvo) {
                    currentConversationId = 'convo-' + Date.now();
                    const title = userMessage.substring(0, 40) + (userMessage.length > 40 ? '...' : '');
                    currentConvo = {
                        id: currentConversationId,
                        title: title || "Cuộc trò chuyện mới", // Tạm thời
                        isNamedByAI: false,
                        timestamp: Date.now(),
                        messages: []
                    };
                    conversations.unshift(currentConvo); // Add to the top of the list
                    chatHistory = currentConvo.messages;
                    saveConversations(); // <-- SỬA LỖI: Lưu ngay lập tức để các hàm khác có thể tìm thấy
                    renderChatHistorySidebar();
                } else {
                    currentConvo.timestamp = Date.now(); // Update timestamp to sort by recency
                    chatHistory = currentConvo.messages;
                }
            }

            async function sendMessage() {
                if (isAiResponding) {
                    // If AI is responding, this function should not proceed.
                    return;
                }

                if (isRenamingByAI) {
                    showAlertModal("Vui lòng chờ", "AI đang đặt tên cho một cuộc trò chuyện khác. Vui lòng thử lại sau giây lát.");
                    return;
                }

                let message = messageInput.value.trim();

                if (checkUsageLimits()) {
                    sendBtn.classList.remove('loading');
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    return;
                }
                
                // Ưu tiên kiểm tra chế độ kết hợp
                if (isInternetSearchMode && deepThinkMode !== 'off') {
                    handleCombinedSearchAndThink(message);
                    return;
                }

                // Chuyển hướng đến các trình xử lý chế độ đặc biệt trước
                if (isInternetSearchMode) {
                    handleInternetSearch(message);
                    return;
                }
                if (deepThinkMode !== 'off') {
                    handleDeepThink(message);
                    return;
                }
                // The research mode is initiated by its own button, not here.
                if (researchBtn.classList.contains('active')) {
                    return; // Prevent sending while research is active
                }

                if (message === '' && !uploadedFile) return;

                manageCurrentConversation(message);

                // Ẩn chỉ báo trạng thái file
                fileStatusIndicator.style.display = 'none';

                // Hide empty state if it's the first message
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                } 

                // Thêm tin nhắn của người dùng vào giao diện.
                // Hàm addMessage sẽ xử lý việc hiển thị file.
                addMessage('user', message, uploadedFile);

                const userParts = [];
                if (message) {
                    userParts.push({ text: message });
                }
                
                if (uploadedFile) {
                    const fileData = uploadedFile.data;
                    if (fileData.type === 'image') {
                        // Đối với hình ảnh, thêm phần inline_data cho API
                        userParts.push({
                            inline_data: { mime_type: fileData.mimeType, data: fileData.base64 }
                        });
                    } else {
                        // Đối với các tệp khác, hãy tạo một bản tóm tắt văn bản
                        let fileSummary = '';
                        switch(fileData.type) {
                            case 'text':
                                const isTruncated = fileData.content.length > 4000;
                                const truncatedContent = isTruncated ? fileData.content.substring(0, 4000) : fileData.content;
                                fileSummary = `[Nội dung file ${uploadedFile.file.name}:\n${truncatedContent}${isTruncated ? '...' : ''}]`;
                                break;
                            case 'powerpoint':
                                const slidesSummary = fileData.slides.map(slide => `- ${slide.title}`).join('\n');
                                fileSummary = `[File PowerPoint: ${uploadedFile.file.name}, ${fileData.slides.length} slides:\n${slidesSummary}]`;
                                break;
                            default:
                                fileSummary = `[File đã tải lên: ${uploadedFile.file.name}, định dạng: ${uploadedFile.file.type}]`;
                        }
                        
                        // Thêm tóm tắt vào trước phần văn bản hiện có hoặc thêm một phần mới
                        if (userParts.length > 0 && userParts[0].text) {
                            userParts[0].text = `${fileSummary}\n\n${userParts[0].text}`;
                        } else {
                            userParts.unshift({ text: fileSummary });
                        }
                    }
                }

                chatHistory.push({ role: 'user', parts: userParts });
                saveConversations();
                
                // Xóa đầu vào và file
                messageInput.value = '';
                messageInput.style.height = 'auto';
                fileUpload.value = '';
                uploadedFile = null;
                sendBtn.disabled = true;
                
                // Hiển thị trạng thái tải
                sendBtn.classList.add('loading');
                isAiResponding = true;
                setInputControlsState(true);
                sendBtn.disabled = false; // Ensure the stop button is always enabled
                sendBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                    </svg>
                `;
                currentAbortController = new AbortController();

                typingIndicator.style.display = 'flex';
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                let temperature;

                // Lọc ra các tin nhắn hệ thống (chứa panel) khỏi lịch sử gửi đến API
                const apiChatHistory = chatHistory.filter(msg => !msg.panel);


                if (userProfile.tier === 'admin') {
                    temperature = mapIntelligenceToTemp(aiIntelligence);
                } else if (userProfile.tier === 'plus') {
                    temperature = mapIntelligenceToTemp(70);
                } else { // normal user
                    temperature = mapIntelligenceToTemp(50);
                }

                const bodyPayload = {
                    contents: apiChatHistory,
                    generationConfig: {
                        temperature: temperature,
                        topK: 1,
                        topP: 1,
                        maxOutputTokens: 4096,
                        stopSequences: []
                    },
                    safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" } ]
                };

                const lowerCaseMessage = message.toLowerCase();
                const searchKeywords = ['hôm nay', 'ngày mấy', 'tháng mấy', 'bây giờ', 'hiện tại', 'mới nhất', 'gần đây', 'thời tiết', 'giá cổ phiếu', 'tỷ giá'];
                const autoSearch = searchKeywords.some(keyword => lowerCaseMessage.includes(keyword));

                // Tự động tìm kiếm "âm thầm" khi không ở chế độ tìm kiếm chuyên dụng
                if (autoSearch) {
                    const searchResult = await performInternetSearch(message, false); // false = không hiển thị UI
                    let searchResultsContext = '';
                    if (searchResult.error) {
                        searchResultsContext = searchResult.error;
                    } else if (searchResult.data && searchResult.data.items && searchResult.data.items.length > 0) {
                        const items = searchResult.data.items;
                        const context = items.slice(0, 3).map((item, index) => `Kết quả ${index + 1}:\n- Tiêu đề: ${item.title}\n- Đoạn trích: ${item.snippet}`).join('\n\n');
                        searchResultsContext = `[Dưới đây là các kết quả tìm kiếm trên Internet để tham khảo:\n\n${context}\n]`;
                    }

                    if (searchResultsContext) {
                        // Thêm bối cảnh tìm kiếm vào trước tin nhắn của người dùng
                        if (apiChatHistory[apiChatHistory.length - 1].parts[0].text) {
                            apiChatHistory[apiChatHistory.length - 1].parts[0].text = `${searchResultsContext}\n\n---\n\nDựa vào thông tin trên, hãy trả lời câu hỏi sau: ${apiChatHistory[apiChatHistory.length - 1].parts[0].text}`;
                        } else {
                            apiChatHistory[apiChatHistory.length - 1].parts.unshift({ text: searchResultsContext });
                        }
                    }
                }

                try {
                    userProfile.requestsToday++;
                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, bodyPayload, 2, 1000, currentAbortController.signal);
                    
                    const data = await response.json();
                    
                    typingIndicator.style.display = 'none';

                    const candidate = data.candidates?.[0];
                    if (candidate?.content?.parts?.[0]?.text) {
                        const aiResponse = candidate.content.parts[0].text;

                        // Đặt tên cuộc trò chuyện bằng AI nếu đây là tin nhắn đầu tiên
                        let currentConvo = conversations.find(c => c.id === currentConversationId);
                        if (currentConvo && !currentConvo.isNamedByAI && currentConvo.messages.length === 1) {
                            // Tạo một lịch sử tạm thời bao gồm cả câu hỏi và câu trả lời để AI có đủ ngữ cảnh
                            const tempHistoryForTitle = [...currentConvo.messages, { role: 'model', parts: [{ text: aiResponse }] }];
                            const newTitle = await getAiChatTitle(tempHistoryForTitle);
                            if (newTitle) {
                                currentConvo.title = newTitle;
                                currentConvo.isNamedByAI = true;
                                renderChatHistorySidebar();
                            }
                        }

                        await addMessageWithTypingEffect('ai', aiResponse);
                        chatHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
                        saveConversations();
                    } else {
                        console.error("API Error Response:", data);
                        let errorMessage = "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại.";
                        if (candidate?.finishReason && candidate.finishReason !== "STOP") {
                            errorMessage = `Yêu cầu đã bị dừng với lý do: ${candidate.finishReason}.`;
                            if (data.promptFeedback?.blockReason) {
                                errorMessage += ` Chi tiết: ${data.promptFeedback.blockReason}.`;
                            }
                        }
                        addMessage('ai', errorMessage);
                    }
                } catch (error) {
                    // Use the centralized error handler
                    handleApiError(error);
                } finally {
                    sendBtn.classList.remove('loading');
                    isAiResponding = false;
                    setInputControlsState(false);
                    currentAbortController = null;
                    sendBtn.innerHTML = `
                        <div class="spinner" id="sendSpinner"></div>
                        <svg id="sendIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 11L12 4M12 4L19 11M12 4V21" />
                        </svg>
                    `;

                    typingIndicator.style.display = 'none';
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    saveUserProfile();
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            async function regenerateResponse() {
                if (isAiResponding) return;

                // Find the last user message and the last AI message
                const lastAiMessageIndex = chatHistory.map(m => m.role).lastIndexOf('model');
                if (lastAiMessageIndex === -1) {
                    showAlertModal("Lỗi", "Không tìm thấy câu trả lời nào của AI để tạo lại.");
                    return;
                }

                // Remove the last AI response and any feedback associated with it
                chatHistory.splice(lastAiMessageIndex);

                // Also remove any system panels that might be right after the user message
                const lastUserMessageIndex = chatHistory.map(m => m.role).lastIndexOf('user');
                if (lastUserMessageIndex !== -1) {
                    // Remove everything after the last user message
                    chatHistory.splice(lastUserMessageIndex + 1);
                }

                // Remove the corresponding messages from the DOM
                const messagesInDom = Array.from(chatContainer.querySelectorAll('.message'));
                const lastUserMessageDomIndex = messagesInDom.map(m => m.classList.contains('message-user')).lastIndexOf(true);
                
                if (lastUserMessageDomIndex !== -1) {
                    // Remove all messages after the last user message
                    messagesInDom.slice(lastUserMessageDomIndex + 1).forEach(msg => msg.remove());
                }

                // Now, resend the request
                // This is a simplified version of sending a message, as we don't need to add a new user message
                sendBtn.disabled = true;
                sendBtn.classList.add('loading');
                isAiResponding = true;
                setInputControlsState(true); // Disable controls
                currentAbortController = new AbortController();
                typingIndicator.style.display = 'flex';
                chatContainer.scrollTop = chatContainer.scrollHeight;

                // We can reuse the main sendMessage logic by temporarily setting the message and then calling it
                // A cleaner way is to extract the API call logic into its own function.
                // For now, let's just call a new function.
                await executeApiCall(chatHistory);
            }

            async function executeApiCall(historyPayload) {
                // This function would contain the try/catch/finally block from sendMessage
                // For this refactor, I will just call sendMessage and it will handle the rest.
                // This is a bit of a hack, but avoids a larger refactor. The state is already set.
                await sendMessage(); // This will now use the modified chatHistory
            }

            function createCombinedPanel() {
                const panelDiv = document.createElement('div');
                panelDiv.className = 'message message-ai combined-panel';
                panelDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar message-ai">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
                            </div>
                            <div class="message-content ai-panel-content">
                            <div class="deep-think-header">
                                <div class="deep-think-header-main">
                                    <h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" style="margin-left: -8px; margin-right: 4px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"></path></svg>
                                        Searching & Thinking...
                                    </h3>
                                    <div class="deep-think-timer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span class="deep-think-timer-value">0s</span>
                                    </div>
                                </div>
                                <button class="panel-toggle-btn" title="Ẩn/Hiện chi tiết"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                            </div>
                            <div class="panel-body">
                                <div class="deep-think-section"><h4>Bước 1: Tìm kiếm trên Internet</h4><div class="search-results-content">Đang khởi tạo...</div></div>
                                <div class="deep-think-section"><h4>Bước 2: Quá trình suy nghĩ</h4><div class="thought-process-content">Đang chờ kết quả tìm kiếm...</div></div>
                            </div>
                        </div>
                    </div>
                `;
                return panelDiv;
            }

            async function handleCombinedSearchAndThink(message) {
                if (isAiResponding) {
                    // If AI is responding, this function should not proceed.
                    return;
                }

                if (checkUsageLimits()) {
                    sendBtn.classList.remove('loading');
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    return;
                }

                if (message === '' && !uploadedFile) return;

                // Bật trạng thái tải
                sendBtn.disabled = true;
                sendBtn.classList.add('loading');
                isAiResponding = true;                setInputControlsState(true);
                currentAbortController = new AbortController();

                // Hide empty state and file status
                fileStatusIndicator.style.display = 'none';
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                }

                addMessage('user', message, uploadedFile);
                saveConversations(); // <-- SỬA LỖI: Đảm bảo trạng thái được lưu trước khi gọi API

                const userParts = [];
                if (message) userParts.push({ text: message });
                chatHistory.push({ role: 'user', parts: userParts });
                saveConversations();

                messageInput.value = '';
                messageInput.style.height = 'auto';
                fileUpload.value = '';
                uploadedFile = null;

                const panel = createCombinedPanel();
                chatContainer.insertBefore(panel, typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                try {
                    const timerElement = panel.querySelector('.deep-think-timer-value');
                    startTimer(timerElement);

                    // --- Step 1: Internet Search ---
                    const searchResultsContainer = panel.querySelector('.search-results-content');
                    searchResultsContainer.innerHTML = ''; // Clear "Đang khởi tạo..."
                    const searchResult = await performInternetSearch(message, true); // true = show UI elements within the panel

                    let searchContext = '';
                    if (searchResult.error) {
                        searchResultsContainer.innerHTML = `<p style="color: var(--text-secondary);">${searchResult.error}</p>`;
                        searchContext = `[Lỗi tìm kiếm: ${searchResult.error}]`;
                    } else if (searchResult.data && searchResult.data.items && searchResult.data.items.length > 0) {
                        const items = searchResult.data.items;
                        items.slice(0, 5).forEach(item => {
                            searchResultsContainer.appendChild(renderSearchResultItem(item));
                        });

                        // --- Bước mới: Đọc nội dung trang web ---
                        const readingStep = document.createElement('div');
                        readingStep.className = 'thought-step';
                        readingStep.innerHTML = `<div class="spinner" style="display: inline-block; width: 16px; height: 16px; border-width: 2px; border-top-color: var(--text-secondary); animation: spin 1s linear infinite;"></div> <span>Đang đọc nội dung trang web...</span>`;
                        thoughtProcessElement.appendChild(readingStep);

                        const topResultsToRead = items.slice(0, 3);
                        const contentPromises = topResultsToRead.map(item => fetchAndParseUrl(item.link, currentAbortController.signal));
                        const fetchedContents = await Promise.all(contentPromises);

                        readingStep.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Đã phân tích xong nội dung web.</span>`;

                        searchContext = `[Dưới đây là nội dung chi tiết từ các trang web hàng đầu để tham khảo:\n\n${topResultsToRead.map((item, index) => `--- NGUỒN ${index + 1}: ${item.title} (${item.link}) ---\n${fetchedContents[index]}\n`).join('\n')}\n]`;

                    } else {
                        searchResultsContainer.innerHTML = `<p style="color: var(--text-secondary);">Không tìm thấy kết quả nào.</p>`;
                        searchContext = "[Không tìm thấy kết quả nào trên Internet.]";
                    }
                    chatContainer.scrollTop = chatContainer.scrollHeight;

                    // --- Step 2: Deep Think Simulation ---
                    const thoughtProcessElement = panel.querySelector('.thought-process-content');
                    thoughtProcessElement.innerHTML = ''; // Clear "Đang chờ..."
                    
                    // Choose the right thinking simulation
                    if (deepThinkMode === 'deepest') {
                        await simulateDeepestThinkingProcess(thoughtProcessElement, currentAbortController.signal);
                    } else if (deepThinkMode === 'deeper') {
                        await simulateDeeperThinkingProcess(thoughtProcessElement, currentAbortController.signal);
                    } else { // 'normal'
                        await simulateThinkingProcess(thoughtProcessElement, currentAbortController.signal);
                    }

                    // --- Final API Call ---
                    clearInterval(deepThinkTimerInterval);
                    const panelHeader = panel.querySelector('.deep-think-header h3');
                    panelHeader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất`;

                    const toggleBtn = panel.querySelector('.panel-toggle-btn');
                    const panelBody = panel.querySelector('.panel-body');
                    toggleBtn?.classList.add('collapsed');
                    panelBody?.classList.add('collapsed');

                    // Prepend context to the last user message
                    // Lọc ra các tin nhắn hệ thống (chứa panel) khỏi lịch sử gửi đến API
                    const apiCallHistory = JSON.parse(JSON.stringify(chatHistory.filter(msg => !msg.panel)));


                    const lastApiMessage = apiCallHistory[apiCallHistory.length - 1];
                    const originalUserMessage = lastApiMessage.parts[0].text;

                    if (lastApiMessage.parts.length > 0 && lastApiMessage.parts[0].text) {
                        lastApiMessage.parts[0].text = `${searchContext}\n\n---\n\nDựa vào thông tin trên và suy nghĩ một cách sâu sắc, hãy trả lời câu hỏi sau: ${originalUserMessage}`;
                    } else {
                        lastApiMessage.parts.unshift({ text: searchContext });
                    }


                    let temperature = userProfile.tier === 'admin' ? mapIntelligenceToTemp(aiIntelligence) : (userProfile.tier === 'plus' ? mapIntelligenceToTemp(70) : mapIntelligenceToTemp(50));

                    const bodyPayload = {
                        contents: apiCallHistory,
                        generationConfig: { 
                            temperature: temperature, 
                            topK: 1, 
                            topP: 1, 
                            maxOutputTokens: 8192 
                        },
                        safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" } ]
                    };

                    userProfile.requestsToday++;
                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, bodyPayload, 2, 1000, currentAbortController.signal);

                    const data = await response.json();
                    const candidate = data.candidates?.[0];

                    if (candidate?.content?.parts?.[0]?.text) {
                        const aiResponse = candidate.content.parts[0].text;

                        // Đặt tên cuộc trò chuyện bằng AI nếu đây là tin nhắn đầu tiên
                        let currentConvo = conversations.find(c => c.id === currentConversationId);
                        if (currentConvo && !currentConvo.isNamedByAI && currentConvo.messages.length === 1) {
                            const tempHistoryForTitle = [...currentConvo.messages, { role: 'model', parts: [{ text: aiResponse }] }];
                            const newTitle = await getAiChatTitle(tempHistoryForTitle);
                            if (newTitle) {
                                currentConvo.title = newTitle;
                                currentConvo.isNamedByAI = true;
                                renderChatHistorySidebar();
                            }
                        }

                        const panelData = {
                            type: 'combined',
                            mode: deepThinkMode,
                            searchResults: searchResult.data?.items || [],
                            isCollapsed: true
                        };
                        chatHistory.push({ role: 'system', panel: panelData });

                        await addMessageWithTypingEffect('ai', aiResponse);
                        chatHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
                        saveConversations();
                    } else {
                        throw new Error("Không nhận được phản hồi hợp lệ từ AI sau khi kết hợp tìm kiếm và suy nghĩ.");
                    }

                } catch (error) {
                    clearInterval(deepThinkTimerInterval);
                    // Use the centralized error handler
                    handleApiError(error, panel);
                } finally {
                    // Reset both modes
                    isInternetSearchMode = false;
                    internetSearchBtn.classList.remove('active');
                    deepThinkMode = 'off';
                    deepThinkBtn.classList.remove('active');
                    document.querySelectorAll('.deep-think-option').forEach(opt => opt.classList.remove('active'));

                    // Tắt trạng thái tải
                    sendBtn.classList.remove('loading');
                    isAiResponding = false;
                    setInputControlsState(false);
                    currentAbortController = null;

                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    saveUserProfile();
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            async function getAiRefinedQuery(originalQuery) {
                try {
                    const refineQueryPrompt = `Based on the user's query: "${originalQuery}", generate an optimal, concise search engine query to find the most relevant and up-to-date information. Your response must be ONLY the search query string, without any other text, quotes, or explanation.`;
                    
                    const payload = {
                        contents: [{ parts: [{ text: refineQueryPrompt }] }],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 50, // A search query is short
                        }
                    };

                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, payload);
                    const data = await response.json();
                    const refinedQuery = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();

                    if (refinedQuery) {
                        // Clean up potential markdown or quotes
                        return refinedQuery.replace(/["'`]/g, '');
                    }
                    return originalQuery; // Fallback to original
                } catch (error) {
                    console.warn("AI query refinement failed, using original query.", error);
                    return originalQuery; // Fallback on error
                }
            }

            async function handleInternetSearch(message) {
                if (isAiResponding) {
                    // If AI is responding, this function should not proceed.
                    return;
                }

                if (checkUsageLimits()) {
                    sendBtn.classList.remove('loading');
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    return;
                }
            
                if (message === '' && !uploadedFile) return;
            
                manageCurrentConversation(message);
            
                // Bật trạng thái tải
                sendBtn.disabled = true;
                sendBtn.classList.add('loading');
                isAiResponding = true;                setInputControlsState(true);
                currentAbortController = new AbortController();
            
                fileStatusIndicator.style.display = 'none';
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                }
            
                addMessage('user', message, uploadedFile);
            
                const userParts = [];
                if (message) userParts.push({ text: message });
                chatHistory.push({ role: 'user', parts: userParts });
                saveConversations();
            
                messageInput.value = '';
                messageInput.style.height = 'auto';
                fileUpload.value = '';
                uploadedFile = null;
            
                const panel = createSearchPanel();
                chatContainer.insertBefore(panel, typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            
                const timerElement = panel.querySelector('.deep-think-timer-value');
                startTimer(timerElement);
                const simulatedStepsContainer = panel.querySelector('.simulated-steps-content');
            
                try {
                    // --- Step 1: Refine Query ---
                    const step1Div = document.createElement('div');
                    step1Div.className = 'thought-step';
                    step1Div.innerHTML = `<div class="spinner" style="display: inline-block; width: 16px; height: 16px; border-width: 2px; border-top-color: var(--text-secondary); animation: spin 1s linear infinite;"></div> <span>Đang tối ưu hóa từ khóa tìm kiếm...</span>`;
                    simulatedStepsContainer.appendChild(step1Div);

                    const refinedQuery = await getAiRefinedQuery(message);
                    step1Div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Đã tối ưu hóa từ khóa.</span>`;
                    
                    const step1Header = panel.querySelector('.step-1-header');
                    step1Header.innerHTML = `Bước 1: Kết quả cho "<strong>${escapeHtml(refinedQuery)}</strong>"`;

                    // --- Step 2: Fetch and display results ---
                    const step2Div = document.createElement('div');
                    step2Div.className = 'thought-step';
                    step2Div.innerHTML = `<div class="spinner" style="display: inline-block; width: 16px; height: 16px; border-width: 2px; border-top-color: var(--text-secondary); animation: spin 1s linear infinite;"></div> <span>Đang truy xuất kết quả...</span>`;
                    simulatedStepsContainer.appendChild(step2Div);

                    const searchResult = await performInternetSearch(refinedQuery, true);
                    
                    const step1Container = panel.querySelector('.search-results-content');
                    let searchContext = '[Không tìm thấy kết quả nào trên Internet.]';
                    allSearchResults = []; // Reset global search results

                    if (searchResult.error) {
                        step1Container.innerHTML = `<p style="color: var(--text-secondary);">${searchResult.error}</p>`;
                        searchContext = `[Lỗi tìm kiếm: ${searchResult.error}]`;
                        step2Div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18" style="color: red;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg> <span>Lỗi khi truy xuất kết quả.</span>`;
                    } else if (searchResult.data && searchResult.data.items && searchResult.data.items.length > 0) {
                        allSearchResults = searchResult.data.items;
                        const totalResults = searchResult.data.searchInformation?.formattedTotalResults || allSearchResults.length;
                        const displayCount = 3;
                        
                        step2Div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Tìm thấy khoảng ${totalResults} kết quả.</span>`;


                        allSearchResults.slice(0, displayCount).forEach(item => {
                            step1Container.appendChild(renderSearchResultItem(item));
                        });

                        if (allSearchResults.length > displayCount) {
                            const remainingCount = allSearchResults.length - displayCount;
                            const moreBtn = document.createElement('button');
                            moreBtn.className = 'more-results-btn';
                            moreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Xem thêm ${remainingCount} kết quả`;
                            moreBtn.addEventListener('click', () => {
                                resultsSidebarContent.innerHTML = ''; // Clear previous
                                allSearchResults.slice(displayCount).forEach(item => {
                                    resultsSidebarContent.appendChild(renderSearchResultItem(item));
                                });
                                resultsSidebar.classList.add('visible');
                            });
                            step1Container.appendChild(moreBtn);
                        }

                        // --- Bước mới: Đọc nội dung trang web ---
                        const step3Div = document.createElement('div');
                        step3Div.className = 'thought-step';
                        step3Div.innerHTML = `<div class="spinner" style="display: inline-block; width: 16px; height: 16px; border-width: 2px; border-top-color: var(--text-secondary); animation: spin 1s linear infinite;"></div> <span>Đang đọc nội dung trang web...</span>`;
                        simulatedStepsContainer.appendChild(step3Div);

                        const topResultsToRead = allSearchResults.slice(0, 3);
                        const contentPromises = topResultsToRead.map(item => fetchAndParseUrl(item.link, currentAbortController.signal));
                        const fetchedContents = await Promise.all(contentPromises);

                        step3Div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Đã phân tích xong nội dung web.</span>`;

                        searchContext = `[Dưới đây là nội dung chi tiết từ các trang web hàng đầu để tham khảo:\n\n${topResultsToRead.map((item, index) => `--- NGUỒN ${index + 1}: ${item.title} (${item.link}) ---\n${fetchedContents[index]}\n`).join('\n')}\n]`;
                    } else {
                        step1Container.innerHTML = `<p style="color: var(--text-secondary);">Không tìm thấy kết quả nào.</p>`;
                        step2Div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Hoàn tất. Không có kết quả.</span>`;
                    }
                    chatContainer.scrollTop = chatContainer.scrollHeight;

                    // --- Final API Call ---
                    clearInterval(deepThinkTimerInterval);
                    const panelHeader = panel.querySelector('.search-panel-header h3, .deep-think-header h3');
                    panelHeader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất tìm kiếm`;

                    const toggleBtn = panel.querySelector('.panel-toggle-btn');
                    const panelBody = panel.querySelector('.panel-body');
                    toggleBtn?.classList.add('collapsed');
                    panelBody?.classList.add('collapsed');

                    // Lọc ra các tin nhắn hệ thống (chứa panel) khỏi lịch sử gửi đến API
                    const apiCallHistory = JSON.parse(JSON.stringify(chatHistory.filter(msg => !msg.panel)));
                    const lastApiMessage = apiCallHistory[apiCallHistory.length - 1];

                    if (lastApiMessage.parts.length > 0 && lastApiMessage.parts[0].text) {
                        lastApiMessage.parts[0].text = `${searchContext}\n\n---\n\nDựa vào thông tin trên, hãy trả lời câu hỏi sau: ${lastApiMessage.parts[0].text}`;
                    } else {
                        lastApiMessage.parts.unshift({ text: searchContext });
                    }

                    let temperature = userProfile.tier === 'admin' ? mapIntelligenceToTemp(aiIntelligence) : (userProfile.tier === 'plus' ? mapIntelligenceToTemp(70) : mapIntelligenceToTemp(50));

                    const bodyPayload = {
                        contents: apiCallHistory,
                        generationConfig: { temperature, topK: 1, topP: 1, maxOutputTokens: 8192 },
                        safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" } ]
                    };

                    userProfile.requestsToday++;
                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, bodyPayload, 2, 1000, currentAbortController.signal);
                    const data = await response.json();
                    const candidate = data.candidates?.[0];

                    if (candidate?.content?.parts?.[0]?.text) {
                        const aiResponse = candidate.content.parts[0].text;

                        // Đặt tên cuộc trò chuyện bằng AI nếu đây là tin nhắn đầu tiên
                        let currentConvo = conversations.find(c => c.id === currentConversationId);
                        if (currentConvo && !currentConvo.isNamedByAI && currentConvo.messages.length === 1) {
                            const tempHistoryForTitle = [...currentConvo.messages, { role: 'model', parts: [{ text: aiResponse }] }];
                            const newTitle = await getAiChatTitle(tempHistoryForTitle);
                            if (newTitle) {
                                currentConvo.title = newTitle;
                                currentConvo.isNamedByAI = true;
                                renderChatHistorySidebar();
                            }
                        }
                        
                        const panelData = {
                            type: 'search',
                            refinedQuery: refinedQuery,
                            results: allSearchResults,
                            isCollapsed: true
                        };
                        chatHistory.push({ role: 'system', panel: panelData });

                        await addMessageWithTypingEffect('ai', aiResponse);
                        chatHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
                        saveConversations();
                    } else {
                        throw new Error("Không nhận được phản hồi hợp lệ từ AI.");
                    }
                } catch (error) {
                    clearInterval(deepThinkTimerInterval);
                    handleApiError(error, panel);
                } finally {
                    // Reset the mode after use
                    isInternetSearchMode = false;
                    internetSearchBtn.classList.remove('active');

                    // Tắt trạng thái tải
                    sendBtn.classList.remove('loading');
                    isAiResponding = false;
                    setInputControlsState(false);
                    currentAbortController = null;

                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    saveUserProfile();
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            function renderSearchResultItem(item) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'search-result-item';
                const faviconUrl = getFaviconUrl(item.link);
                resultDiv.innerHTML = `
                    <img src="${faviconUrl}" class="search-result-favicon" alt="" onerror="this.style.display='none'">
                    <div>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="search-result-title">${item.title}</a>
                        <p class="search-result-snippet">${item.snippet}</p>
                    </div>
                `;
                return resultDiv;
            }

            async function handleDeepThink(message) {
                if (isAiResponding) {
                    // If AI is responding, this function should not proceed.
                    return;
                }

                if (checkUsageLimits()) {
                    sendBtn.classList.remove('loading');
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    return;
                }

                if (message === '' && !uploadedFile) return;

                manageCurrentConversation(message);

                // Bật trạng thái tải
                sendBtn.disabled = true;
                sendBtn.classList.add('loading');
                isAiResponding = true;                setInputControlsState(true);
                currentAbortController = new AbortController();

                // Hide empty state and file status
                fileStatusIndicator.style.display = 'none';
                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                }

                addMessage('user', message, uploadedFile);

                const userParts = [];
                if (message) userParts.push({ text: message });
                chatHistory.push({ role: 'user', parts: userParts });
                saveConversations();

                messageInput.value = '';
                messageInput.style.height = 'auto';
                fileUpload.value = '';
                uploadedFile = null;

                const panel = createDeepThinkPanel();
                chatContainer.insertBefore(panel, typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                try {
                    const timerElement = panel.querySelector('.deep-think-timer-value');
                    const thoughtProcessElement = panel.querySelector('.thought-process-content');
                    
                    startTimer(timerElement);

                    if (deepThinkMode === 'deepest') {
                        panel.querySelector('.deep-think-header h3').innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                            </svg> Deepest Thinking...
                        `;
                    } else if (deepThinkMode === 'deeper') {
                        panel.querySelector('.deep-think-header h3').innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                            </svg> Deeper Thinking...
                        `;
                    } else { // 'normal'
                        // Tiêu đề mặc định cho 'normal'
                        panel.querySelector('.deep-think-header h3').innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"></path></svg>
                            Deep Thinking...
                        `;
                    }

                    // --- BƯỚC 1: TẠO PHẢN HỒI NHÁP (LUỒNG SUY NGHĨ) ---
                    const draftPrompt = `Hãy đóng vai một trợ lý AI và suy nghĩ thành tiếng về cách bạn sẽ trả lời câu hỏi của người dùng. Bắt đầu bằng việc phân tích yêu cầu, sau đó vạch ra các bước bạn sẽ thực hiện. Ví dụ: 'Người dùng muốn tôi... Đầu tiên, tôi sẽ... Sau đó, tôi sẽ...'. Câu hỏi của người dùng: "${message}"`;
                    userProfile.requestsToday++;
                    const draftResponse = await fetchWithApiKeyRotation(API_ENDPOINT, {
                        contents: [{ parts: [{ text: draftPrompt }] }],
                        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 }
                    }, 2, 1000, currentAbortController.signal);
                    const draftData = await draftResponse.json();
                    const draftText = draftData.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể tạo luồng suy nghĩ.";

                    // Hiển thị luồng suy nghĩ trong panel
                    thoughtProcessElement.innerHTML = ''; // Xóa các bước giả lập và nội dung cũ
                    await typeText(thoughtProcessElement, draftText, 15);

                    // Cập nhật panel sau khi xong bước 1
                    const thoughtStepDiv = document.createElement('div');
                    thoughtStepDiv.className = 'thought-step';
                    thoughtStepDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Đã hoàn thành phân tích.</span>`;
                    thoughtProcessElement.appendChild(thoughtStepDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;


                    // --- BƯỚC 2: TẠO PHẢN HỒI THẬT DỰA TRÊN BẢN NHÁP ---
                    const finalPrompt = `Dựa vào kế hoạch/suy nghĩ sau đây, hãy viết một câu trả lời hoàn chỉnh và chi tiết cho câu hỏi gốc của người dùng. Trình bày câu trả lời một cách tự nhiên, không đề cập đến việc bạn đang làm theo kế hoạch.\n\n[Câu hỏi gốc]: "${message}"\n\n[Kế hoạch/Suy nghĩ của bạn]:\n${draftText}\n\n[Câu trả lời hoàn chỉnh]:`;

                    let temperature = userProfile.tier === 'admin' ? mapIntelligenceToTemp(aiIntelligence) : (userProfile.tier === 'plus' ? mapIntelligenceToTemp(70) : mapIntelligenceToTemp(50));

                     const bodyPayload = {
                        contents: [{ parts: [{ text: finalPrompt }] }],
                        generationConfig: { 
                            temperature: temperature, 
                            topK: 1, 
                            topP: 1, 
                            maxOutputTokens: 8192 
                        }, // Increased tokens for detailed answers
                        safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" } ]
                    };
                    
                    userProfile.requestsToday++;
                    const response = await fetchWithApiKeyRotation(API_ENDPOINT, bodyPayload, 2, 1000, currentAbortController.signal); // Sử dụng payload mới
                    const data = await response.json();
                    
                    clearInterval(deepThinkTimerInterval);

                    const candidate = data.candidates?.[0];
                    if (candidate?.content?.parts?.[0]?.text) {
                        const aiResponse = candidate.content.parts[0].text;

                        // Đặt tên cuộc trò chuyện bằng AI nếu đây là tin nhắn đầu tiên
                        let currentConvo = conversations.find(c => c.id === currentConversationId);
                        if (currentConvo && !currentConvo.isNamedByAI && currentConvo.messages.length === 1) {
                            const tempHistoryForTitle = [...currentConvo.messages, { role: 'model', parts: [{ text: aiResponse }] }];
                            const newTitle = await getAiChatTitle(tempHistoryForTitle);
                            if (newTitle) {
                                currentConvo.title = newTitle;
                                currentConvo.isNamedByAI = true;
                                renderChatHistorySidebar();
                            }
                        }

                        const panelHeader = panel.querySelector('.deep-think-header h3');
                        panelHeader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất suy nghĩ`;
                        
                        // Collapse the panel details, but allow user to re-open
                        const toggleBtn = panel.querySelector('.panel-toggle-btn');
                        const panelBody = panel.querySelector('.panel-body');
                        toggleBtn?.classList.add('collapsed');
                        panelBody?.classList.add('collapsed');

                        const panelData = {
                            type: 'deep-think',
                            mode: deepThinkMode,
                            draft: draftText, // Lưu lại bản nháp
                            isCollapsed: true
                        };
                        chatHistory.push({ role: 'system', panel: panelData });

                        // Thêm câu trả lời như một tin nhắn trò chuyện bình thường bên ngoài panel
                        await addMessageWithTypingEffect('ai', aiResponse);
                        
                        chatHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
                        saveConversations();
                    } else {
                        console.error("Deep Think API Error Response:", data);
                        let errorMessage = "Không có phản hồi từ AI.";
                        if (candidate?.finishReason && candidate.finishReason !== "STOP") {
                            errorMessage = `Yêu cầu đã bị dừng với lý do: ${candidate.finishReason}.`;
                            if (data.promptFeedback?.blockReason) {
                                errorMessage += ` Chi tiết: ${data.promptFeedback.blockReason}.`;
                            }
                        }
                        throw new Error(errorMessage);
                    }
                } catch (error) {
                    clearInterval(deepThinkTimerInterval); // Use the centralized error handler
                    handleApiError(error, panel);
                } finally {
                    // Reset the mode after use
                    deepThinkMode = 'off';
                    deepThinkBtn.classList.remove('active');
                    document.querySelectorAll('.deep-think-option').forEach(opt => opt.classList.remove('active'));

                    // Tắt trạng thái tải
                    sendBtn.classList.remove('loading');
                    isAiResponding = false;
                    setInputControlsState(false);
                    currentAbortController = null;

                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    saveUserProfile();
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }
            
            async function handleInDepthResearch(topic) {
                if (isAiResponding) {
                    // If AI is responding, this function should not proceed.
                    return;
                }

                if (checkUsageLimits()) {
                    sendBtn.classList.remove('loading');
                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    return;
                }

                researchBtn.classList.add('active');
                sendBtn.disabled = true;

                // Bật trạng thái tải
                sendBtn.classList.add('loading');
                isAiResponding = true;                setInputControlsState(true);
                currentAbortController = new AbortController();

                if (emptyState && emptyState.style.display !== 'none') {
                    emptyState.style.display = 'none';
                }

                manageCurrentConversation(`Chủ đề nghiên cứu: ${topic}`);

                addMessage('user', `Chủ đề nghiên cứu: ${topic}`);
                chatHistory.push({ role: 'user', parts: [{ text: `Thực hiện nghiên cứu chuyên sâu về chủ đề: "${topic}"` }] }); // This is now handled by manageCurrentConversation

                const panel = createResearchPanel();
                chatContainer.insertBefore(panel, typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                const timerElement = panel.querySelector('.deep-think-timer-value');
                startTimer(timerElement);

                try {
                    // --- Phase 1: Web Search ---
                    const step1Content = panel.querySelector('.step-1-content');
                    addThoughtStep(step1Content, "Bắt đầu tìm kiếm thông tin trên web...", true);
                    const searchResult = await performInternetSearch(topic, false);
                    let webContext = "[Không tìm thấy kết quả tìm kiếm nào.]";
                    if (searchResult.error) {
                        step1Content.innerHTML += `<p style="color:red;">${searchResult.error}</p>`;
                        webContext = `[Lỗi tìm kiếm: ${searchResult.error}]`;
                    } else if (searchResult.data && searchResult.data.items && searchResult.data.items.length > 0) {
                        const items = searchResult.data.items;
                        addThoughtStep(step1Content, `Tìm thấy ${items.length} kết quả. Đang đọc nội dung...`);

                        // Đọc nội dung chi tiết từ các trang web
                        const topResultsToRead = items.slice(0, 5); // Đọc 5 trang cho nghiên cứu sâu
                        const contentPromises = topResultsToRead.map(item => fetchAndParseUrl(item.link, currentAbortController.signal));
                        const fetchedContents = await Promise.all(contentPromises);

                        addThoughtStep(step1Content, `Đã phân tích xong nội dung web.`);
                        webContext = topResultsToRead.map((item, index) => `--- NGUỒN ${index + 1}: ${item.title} (${item.link}) ---\n${fetchedContents[index]}\n`).join('\n');
                    }

                    // --- Phase 2: Information Synthesis (AI Call 1) ---
                    const step2Content = panel.querySelector('.step-2-content');
                    addThoughtStep(step2Content, "Gửi dữ liệu thô cho AI để tổng hợp...", true);
                    userProfile.requestsToday++;
                    const synthesisPrompt = `Dựa trên nội dung chi tiết từ các trang web sau đây về chủ đề "${topic}", hãy tổng hợp các điểm chính, xác định các ý tưởng cốt lõi và loại bỏ thông tin nhiễu. Trả về một bản tóm tắt súc tích, khách quan.\n\nNỘI DUNG WEB:\n${webContext}`;
                    const synthesisResponse = await fetchWithApiKeyRotation(API_ENDPOINT, {
                        contents: [{ parts: [{ text: synthesisPrompt }] }]
                    }, 2, 1000, currentAbortController.signal);
                    const synthesisData = await synthesisResponse.json();
                    const synthesizedText = synthesisData.candidates?.[0]?.content?.parts?.[0]?.text || "[AI không thể tổng hợp thông tin.]";
                    addThoughtStep(step2Content, "Đã nhận được bản tóm tắt từ AI.");

                    // --- Phase 3: Image Search ---
                    const step3Content = panel.querySelector('.step-3-content');
                    addThoughtStep(step3Content, "Tìm kiếm hình ảnh minh họa...", true);
                    const imageResult = await performImageSearch(topic, currentAbortController.signal);
                    let imageUrls = [];
                    if (imageResult.items && imageResult.items.length > 0) {
                        imageUrls = imageResult.items.slice(0, 3).map(item => item.link);
                        const gallery = document.createElement('div');
                        gallery.className = 'research-image-gallery';
                        imageUrls.forEach(url => {
                            gallery.innerHTML += `<img src="${url}" class="research-image-thumbnail" alt="Hình ảnh minh họa">`;
                        });
                        step3Content.appendChild(gallery);
                        addThoughtStep(step3Content, `Đã tìm thấy ${imageUrls.length} hình ảnh phù hợp.`);
                    } else {
                        addThoughtStep(step3Content, "Không tìm thấy hình ảnh phù hợp.");
                    }

                    // --- Phase 4: Final Report Generation (AI Call 2) ---
                    const step4Content = panel.querySelector('.step-4-content');
                    addThoughtStep(step4Content, "Soạn thảo báo cáo cuối cùng...", true);
                    const finalPrompt = `Bạn là một trợ lý nghiên cứu AI chuyên sâu. Nhiệm vụ của bạn là tạo ra một báo cáo chi tiết và toàn diện về chủ đề: "${topic}".

**Bối cảnh đã được tổng hợp từ các nguồn trên Internet:**
${synthesizedText}

**Bạn có thể sử dụng các hình ảnh minh họa sau đây trong báo cáo của mình (sử dụng cú pháp Markdown \`!mô tả\`):**
${imageUrls.map(url => `- ${url}`).join('\n')}

**Yêu cầu báo cáo:**
1.  **Cấu trúc rõ ràng:** Sử dụng tiêu đề, danh sách và các định dạng Markdown khác để làm cho báo cáo dễ đọc.
2.  **Sử dụng bảng:** Khi cần so sánh dữ liệu hoặc liệt kê thông tin có cấu trúc, hãy tạo bảng bằng cú pháp Markdown.
3.  **Tích hợp hình ảnh:** Chèn các hình ảnh đã cung cấp vào những vị trí hợp lý trong báo cáo để minh họa cho các điểm quan trọng.
4.  **Phân tích sâu:** Không chỉ liệt kê thông tin, hãy phân tích, so sánh và đưa ra những nhận định, kết luận có giá trị dựa trên bối cảnh đã cho.

Bây giờ, hãy bắt đầu soạn thảo báo cáo chi tiết.`;

                    userProfile.requestsToday++;
                    const finalResponse = await fetchWithApiKeyRotation(API_ENDPOINT, {
                        contents: [{ parts: [{ text: finalPrompt }] }], generationConfig: { maxOutputTokens: 8192 }
                    }, 2, 1000, currentAbortController.signal);
                    const finalData = await finalResponse.json();
                    const finalReport = finalData.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (finalReport) {
                        clearInterval(deepThinkTimerInterval);
                        panel.querySelector('.deep-think-header h3').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất nghiên cứu`;

                        // Collapse the panel details, but allow user to re-open
                        const toggleBtn = panel.querySelector('.panel-toggle-btn');
                        const panelBody = panel.querySelector('.panel-body');
                        toggleBtn?.classList.add('collapsed');
                        panelBody?.classList.add('collapsed');

                        const panelData = {
                            type: 'research',
                            topic: topic,
                            searchResults: searchResult.data?.items || [],
                            imageUrls: imageUrls,
                            isCollapsed: true
                        };
                        chatHistory.push({ role: 'system', panel: panelData });

                        // Thêm báo cáo cuối cùng như một tin nhắn trò chuyện bình thường
                        await addMessageWithTypingEffect('ai', finalReport);

                        chatHistory.push({ role: 'model', parts: [{ text: finalReport }] });
                        saveConversations();
                    } else {
                        throw new Error("AI không thể tạo báo cáo cuối cùng.");
                    }

                } catch (error) {
                    clearInterval(deepThinkTimerInterval);
                    // Use the centralized error handler
                    handleApiError(error, panel);
                } finally {
                    researchBtn.classList.remove('active');

                    // Tắt trạng thái tải
                    sendBtn.classList.remove('loading');
                    isAiResponding = false;
                    setInputControlsState(false);
                    currentAbortController = null;

                    sendBtn.disabled = messageInput.value.trim() === '' && !uploadedFile;
                    saveUserProfile();
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            function addThoughtStep(container, text, isNewSection = false) {
                if (isNewSection) {
                    container.innerHTML = ''; // Clear previous "thinking..." message
                }
                const stepDiv = document.createElement('div');
                stepDiv.className = 'thought-step';
                stepDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>${text}</span>`;
                container.appendChild(stepDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            // Function to add message with typing effect
            async function addMessageWithTypingEffect(sender, content) {
                const messageDiv = document.createElement('div');
                messageDiv.dataset.id = `msg-${Date.now()}-${Math.random()}`;
                messageDiv.className = `message message-${sender}`;
                const avatarClass = sender === 'user' ? 'user-avatar-bg' : '';

                messageDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar ${avatarClass}">
                            ${sender === 'user' ? '<svg xmlns="<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' :
                                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>'}
                        </div>
                        <div class="message-content" id="typing-content"></div>
                    </div>
                `;
                
                chatContainer.insertBefore(messageDiv, typingIndicator);
                
                const contentElement = messageDiv.querySelector('.message-content');
                
                // Display content with typing effect
                await typeText(contentElement, content, 10, true); // Pass true to process markdown

                // Add action buttons for AI messages after typing is complete
                addMessageActions(messageDiv, sender);
            }
            
            // Function to process content and identify code blocks and markdown formatting
            function processContentWithCodeBlocks(content) {
                // This function is now simplified as marked.js handles code blocks.
                // We just need to return the processed HTML.
                return processMarkdown(content);
            }
            
            // Function to process markdown formatting
            function processMarkdown(text) {
                if (typeof marked === 'undefined') {
                    console.error('marked.js is not loaded!');
                    return text.replace(/\n/g, '<br>'); // Fallback
                }
                // Cấu hình marked.js để tương thích tốt hơn với GFM (GitHub Flavored Markdown)
                // và thêm ngắt dòng tự động
                return marked.parse(text, { gfm: true, breaks: true });
            }
            
            // Function to type content with code blocks
            async function typeContent(element, parts) {
                for (const part of parts) {
                    if (part.type === 'text') {
                        await typeText(element, part.content);
                    } else if (part.type === 'code') {
                        await typeCodeBlock(element, part.content, part.language);
                    }
                }
            }
            
            // Function to type regular text
            async function typeText(element, text, speed = 10, useMarkdown = false) {
                for (let i = 0; i < text.length; i++) {
                    let currentText = text.substring(0, i + 1);
                    if (useMarkdown) {
                        // Render markdown progressively
                        element.innerHTML = processMarkdown(currentText) + '<span class="typing-cursor"></span>';
                    } else {
                        // Render plain text
                        element.textContent = currentText;
                        element.innerHTML += '<span class="typing-cursor"></span>';
                    }
                    await new Promise(resolve => setTimeout(resolve, speed));
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
                // Final render with full content and highlighting
                element.innerHTML = useMarkdown ? processMarkdown(text) : escapeHtml(text);
                postProcessRenderedContent(element);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            // Function to type a code block
            async function typeCodeBlock(element, code, language) {
                const existingContent = element.innerHTML;
                const isHtml = language && language.toLowerCase() === 'html';
                
                // Create code block container
                const codeBlockId = 'code-' + Math.random().toString(36).substr(2, 9);
                element.innerHTML = existingContent + 
                    `<div class="code-block" id="${codeBlockId}">
                        <div class="code-header">
                            <span class="code-language">${language || 'code'}</span>
                            <div class="code-actions">
                                <button class="code-btn copy-btn" title="Copy code">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                </button>
                                ${isHtml ? `
                                <button class="code-btn preview-btn" title="Toggle Preview">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="code-content">
                            <pre><code class="${language ? `language-${language}` : ''}"></code></pre>
                        </div>
                    </div>`;
                
                const codeElement = document.querySelector(`#${codeBlockId} code`);
                const speed = 5; // typing speed for code (lower is faster)
                
                for (let i = 0; i <= code.length; i++) {
                    codeElement.textContent = code.substring(0, i);
                    await new Promise(resolve => setTimeout(resolve, speed));
                    
                    // Scroll to bottom as we type
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                // After typing is complete, highlight the block
                if (window.hljs) {
                    hljs.highlightElement(codeElement);
                }
            }
            
            // Function to add copy functionality to code blocks
            function addCopyFunctionality(messageDiv) {
                messageDiv.querySelectorAll('.copy-btn').forEach(btn => {
                    const originalIcon = btn.innerHTML;
                    const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;

                    btn.addEventListener('click', function() {
                        const codeBlock = this.closest('.code-block');
                        const codeContent = codeBlock.querySelector('code').textContent;
                        
                        navigator.clipboard.writeText(codeContent).then(() => {
                            this.innerHTML = successIcon;
                            
                            setTimeout(() => {
                                this.innerHTML = originalIcon;
                            }, 2000);
                        });
                    });
                });
            }
            
            // Function to add preview functionality to code blocks
            function addPreviewFunctionality(messageDiv) {
                messageDiv.querySelectorAll('.preview-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Deactivate other preview buttons
                        document.querySelectorAll('.preview-btn.active').forEach(b => b.classList.remove('active'));

                        const codeBlock = this.closest('.code-block');
                        const codeContent = codeBlock.querySelector('code').textContent;

                        // Extract title from the HTML code
                        const titleMatch = codeContent.match(/<title>(.*?)<\/title>/i);
                        const title = titleMatch ? titleMatch[1] : 'HTML Preview';

                        // Update and show the preview sidebar
                        previewSidebarTitle.textContent = title;
                        previewSidebarFrame.srcdoc = codeContent;
                        previewSidebar.classList.add('visible');
                        this.classList.add('active'); // Activate the clicked button
                    });
                });
            }
            
            // Function to add message immediately (without typing effect)
            function addMessage(sender, content, fileInfo = null) {
                const messageDiv = document.createElement('div');
                messageDiv.dataset.id = `msg-${Date.now()}-${Math.random()}`;
                messageDiv.className = `message message-${sender}`;
                const avatarClass = sender === 'user' ? 'user-avatar-bg' : '';
                
                let contentHTML = '';

                // Xử lý hiển thị file cho tin nhắn của người dùng
                if (sender === 'user' && fileInfo) {
                    const fileData = fileInfo.data;
                    if (fileData.type === 'image') {
                        // Đối với hình ảnh, hiển thị ảnh
                        contentHTML += `<img src="${fileData.url}" class="file-preview" style="display: block; margin-bottom: 8px; border-radius: 8px; max-width: 300px; max-height: 300px;">`;
                    } else {
                        // Đối với các tệp khác, hiển thị nhãn văn bản
                        contentHTML += `<p style="font-style: italic; color: var(--text-secondary); margin-bottom: 8px; padding: 8px 12px; background-color: var(--bg-hover); border-radius: 6px; border: 1px solid var(--border-light);">📎 File đính kèm: <strong>${fileInfo.file.name}</strong></p>`;
                    }
                }

                // Xử lý nội dung văn bản nếu có
                if (content && content.trim() !== '') {
                    // Sử dụng marked.js để chuyển đổi toàn bộ nội dung
                    contentHTML += processMarkdown(content);
                }

                messageDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar ${avatarClass}">
                            ${sender === 'user' ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' :
                                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>'}
                        </div>
                        <div class="message-content">${contentHTML}</div>
                    </div>
                `;

                chatContainer.insertBefore(messageDiv, typingIndicator);
                
                postProcessRenderedContent(messageDiv);
                // Add action buttons for AI messages
                addMessageActions(messageDiv, sender);
            }

            function addMessageActions(messageDiv, sender) {
                if (sender !== 'ai') return;

                // Remove existing action bar if present
                const existingActions = messageDiv.querySelector('.message-actions');
                if (existingActions) existingActions.remove();

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';

                const isLastAiMessage = !messageDiv.nextElementSibling || !messageDiv.nextElementSibling.classList.contains('message-ai');

                actionsDiv.innerHTML = `
                    <button class="message-action-btn like-btn" title="Thích">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                    </button>
                    <button class="message-action-btn dislike-btn" title="Không thích">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
                    </button>
                    ${isLastAiMessage ? `
                    <button class="message-action-btn regenerate-btn" title="Tạo lại">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                    ` : ''}
                `;

                messageDiv.appendChild(actionsDiv);
            }
            
            function postProcessRenderedContent(containerElement) {
                // 1. Tìm tất cả các khối <pre><code> chưa được xử lý
                containerElement.querySelectorAll('pre > code:not(.hljs)').forEach((block) => {
                    // Highlight cú pháp
                    if (window.hljs) {
                        hljs.highlightElement(block);
                    }

                    // 2. Tạo cấu trúc header cho khối mã
                    const pre = block.parentElement;
                    if (pre.parentElement.classList.contains('code-block')) {
                        // Đã có cấu trúc, không cần tạo lại
                        return;
                    }

                    const codeBlockDiv = document.createElement('div');
                    codeBlockDiv.className = 'code-block';

                    const language = block.className.replace('language-', '').split(' ')[0] || 'code';
                    const isHtml = language.toLowerCase() === 'html';

                    const header = document.createElement('div');
                    header.className = 'code-header';

                    const codeActions = document.createElement('div');
                    codeActions.className = 'code-actions';

                    // Nút sao chép
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'code-btn copy-btn';
                    copyBtn.title = 'Copy code';
                    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
                    copyBtn.addEventListener('click', function() {
                        const codeContent = block.textContent;
                        navigator.clipboard.writeText(codeContent).then(() => {
                            const originalIcon = this.innerHTML;
                            this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
                            setTimeout(() => { this.innerHTML = originalIcon; }, 2000);
                        });
                    });
                    codeActions.appendChild(copyBtn);

                    // Nút xem trước (nếu là HTML)
                    if (isHtml) {
                        const previewBtn = document.createElement('button');
                        previewBtn.className = 'code-btn preview-btn';
                        previewBtn.title = 'Toggle Preview';
                        previewBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
                        previewBtn.addEventListener('click', function() {
                            document.querySelectorAll('.preview-btn.active').forEach(b => b.classList.remove('active'));
                            const codeContent = block.textContent;
                            const titleMatch = codeContent.match(/<title>(.*?)<\/title>/i);
                            const title = titleMatch ? titleMatch[1] : 'HTML Preview';

                            previewSidebarTitle.textContent = title;
                            previewSidebarFrame.srcdoc = codeContent;
                            previewSidebar.classList.add('visible');
                            this.classList.add('active');
                        });
                        codeActions.appendChild(previewBtn);
                    }

                    header.innerHTML = `<span class="code-language">${language}</span>`;
                    header.appendChild(codeActions);

                    // 3. Thay thế <pre> bằng cấu trúc mới
                    pre.parentNode.insertBefore(codeBlockDiv, pre);
                    codeBlockDiv.appendChild(header);
                    codeBlockDiv.appendChild(pre);
                });
            }

            function createDeepThinkPanel() {
                const panelDiv = document.createElement('div');
                panelDiv.className = 'message message-ai deep-think-panel';
                panelDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                            </svg>
                        </div>
                        <div class="message-content ai-panel-content">
                            <div class="deep-think-header">
                                <div class="deep-think-header-main">
                                    <h3><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"></path></svg> Deep Thinking...</h3>
                                    <div class="deep-think-timer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span class="deep-think-timer-value">0s</span>
                                    </div>
                                </div>
                                <button class="panel-toggle-btn" title="Ẩn/Hiện chi tiết"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                            </div>
                            <div class="panel-body">
                                <div class="deep-think-section">
                                    <h4>Quá trình suy nghĩ</h4>
                                    <div class="thought-process-content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                return panelDiv;
            }

            function createResearchPanel() {
                const panelDiv = document.createElement('div');
                panelDiv.className = 'message message-ai research-panel';
                panelDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                             </svg>
                        </div>
                        <div class="message-content ai-panel-content">
                            <div class="deep-think-header">
                                <div class="deep-think-header-main">
                                    <h3><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> Đang nghiên cứu...</h3>
                                    <div class="deep-think-timer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span class="deep-think-timer-value">0s</span>
                                    </div>
                                </div>
                                <button class="panel-toggle-btn" title="Ẩn/Hiện chi tiết"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                            </div>
                            <div class="panel-body">
                                <div class="deep-think-section"><h4>Bước 1: Tìm kiếm trên Web</h4><div class="step-1-content thought-step">Đang khởi tạo...</div></div>
                                <div class="deep-think-section"><h4>Bước 2: Tổng hợp thông tin</h4><div class="step-2-content thought-step">Đang chờ...</div></div>
                                <div class="deep-think-section"><h4>Bước 3: Tìm kiếm hình ảnh</h4><div class="step-3-content thought-step">Đang chờ...</div></div>
                                <div class="deep-think-section"><h4>Bước 4: Soạn thảo báo cáo</h4><div class="step-4-content thought-step">Đang chờ...</div></div>
                            </div>
                        </div>
                    </div>
                `;
                return panelDiv;
            }

            function createSearchPanel() {
                const panelDiv = document.createElement('div');
                panelDiv.className = 'message message-ai search-panel';
                panelDiv.innerHTML = `
                    <div class="message-user">
                        <div class="message-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <div class="message-content ai-panel-content">
                            <div class="search-panel-header deep-think-header">
                                <div class="deep-think-header-main">
                                    <h3><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> Đang tìm kiếm...</h3>
                                    <div class="deep-think-timer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span class="deep-think-timer-value">0s</span>
                                    </div>
                                </div>
                                <button class="panel-toggle-btn" title="Ẩn/Hiện chi tiết"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg></button>
                            </div>
                            <div class="panel-body">
                                <div class="deep-think-section"><h4 class="step-1-header">Bước 1: Các kết quả tìm kiếm</h4><div class="search-results-content"></div></div>
                                <div class="deep-think-section"><h4>Quá trình xử lý</h4><div class="simulated-steps-content"></div></div>
                            </div>
                        </div>
                    </div>
                `;
                return panelDiv;
            }

            function startTimer(timerElement) {
                let seconds = 0;
                timerElement.textContent = '0s';
                deepThinkTimerInterval = setInterval(() => {
                    seconds++;
                    const min = Math.floor(seconds / 60);
                    const sec = seconds % 60;
                    timerElement.textContent = (min > 0 ? `${min}m ` : '') + `${sec}s`;
                }, 1000);
            }

            async function simulateThinkingProcess(container, signal) {
                if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                const steps = [
                    "Phân tích yêu cầu của người dùng...",
                    "Xác định các khái niệm và từ khóa chính...",
                    "Tra cứu và tổng hợp thông tin từ cơ sở dữ liệu...",
                    "Lập dàn ý cho câu trả lời...",
                    "Soạn thảo câu trả lời chi tiết...",
                    "Kiểm tra lại tính chính xác và logic..."
                ];
                for (const step of steps) {
                    if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'thought-step';
                    stepDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>${step}</span>`;
                    container.appendChild(stepDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            async function simulateDeeperThinkingProcess(container, signal) {
                if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                const steps = [
                    "Phân tích cấu trúc câu hỏi...",
                    "Xác định các giả định ngầm...",
                    "Lên ý tưởng về các hướng tiếp cận tiềm năng...",
                    "Truy vấn các cơ sở kiến thức chuyên ngành...",
                    "Đối chiếu các nguồn thông tin chính để tìm mâu thuẫn...",
                    "Tổng hợp các phát hiện thành một cấu trúc mạch lạc...",
                    "Soạn thảo bản nháp phản hồi ban đầu...",
                    "Tinh chỉnh các lập luận và thêm sắc thái...",
                    "Thực hiện đánh giá cuối cùng về sự rõ ràng và chính xác...",
                    "Tối ưu hóa câu trả lời để dễ hiểu hơn..."
                ];
                
                const minDuration = 30000; // At least 30 seconds
                const startTime = Date.now();

                for (const step of steps) {
                    if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'thought-step';
                    stepDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>${step}</span>`;
                    container.appendChild(stepDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < minDuration) {
                    await new Promise(resolve => setTimeout(resolve, minDuration - elapsedTime));
                }
            }

            async function simulateDeepestThinkingProcess(container, signal) {
                if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                const steps = [
                    "Khởi tạo quá trình phân tích đa chiều...",
                    "Phân rã câu hỏi thành các thành phần cốt lõi...",
                    "Xác định các mô hình khái niệm và mối quan hệ ẩn...",
                    "Thực hiện truy vấn song song trên nhiều cơ sở kiến thức...",
                    "Mô phỏng các kịch bản và giả thuyết phản biện...",
                    "Phân tích cảm tính và sắc thái trong ngữ cảnh...",
                    "Đối chiếu chéo thông tin để đảm bảo tính nhất quán tuyệt đối...",
                    "Xây dựng một cây lập luận logic phức tạp...",
                    "Soạn thảo phản hồi nháp với nhiều góc nhìn...",
                    "Tự phê bình và tinh chỉnh câu trả lời để đạt độ chính xác cao nhất...",
                    "Kiểm tra lại các ràng buộc về đạo đức và an toàn...",
                    "Định dạng đầu ra để tối ưu hóa sự rõ ràng và tác động...",
                    "Hoàn tất quá trình tổng hợp thông tin..."
                ];
                
                const minDuration = 80000; // At least 80 seconds
                const startTime = Date.now();

                for (const step of steps) {
                    if (signal?.aborted) throw new DOMException('Aborted by user', 'AbortError');
                    await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000));
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'thought-step';
                    stepDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>${step}</span>`;
                    container.appendChild(stepDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < minDuration) {
                    await new Promise(resolve => setTimeout(resolve, minDuration - elapsedTime));
                }
            }

            // Hàm thực hiện tìm kiếm bằng Google Custom Search API
            async function performInternetSearch(query, showUIMessage, signal = null) {
                if (!CUSTOM_SEARCH_API_KEY || !CUSTOM_SEARCH_ENGINE_ID) {
                    console.warn("Chức năng tìm kiếm chưa được cấu hình.");
                    return { data: null, error: "[Ghi chú cho AI: Hãy thông báo cho người dùng rằng chức năng tìm kiếm trên Internet chưa được cấu hình, vì vậy bạn không thể trả lời các câu hỏi cần thông tin thời gian thực.]" };
                }

                if (showUIMessage) {
                    // UI message is handled by the panel itself
                }
                const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

                try {
                    // Pass the signal to the fetch call
                    const response = await fetch(searchUrl, { signal });
                    const data = await response.json();
                    return { data: data, error: null };
                } catch (error) {
                    console.error("Failed to fetch from Custom Search API:", error);
                    // Lỗi đã được định dạng bởi fetchWithRetry, chỉ cần trích xuất thông báo
                    return { data: null, error: `[Gặp lỗi khi kết nối tới dịch vụ tìm kiếm: ${error.message}]` };
                }
            }

            // Hàm thực hiện tìm kiếm hình ảnh
            async function performImageSearch(query, signal = null) {
                if (!CUSTOM_SEARCH_API_KEY || !CUSTOM_SEARCH_ENGINE_ID) {
                    console.warn("Chức năng tìm kiếm chưa được cấu hình.");
                    return { error: "Chức năng tìm kiếm chưa được cấu hình." };
                }
                const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${CUSTOM_SEARCH_API_KEY}&cx=${CUSTOM_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image`;

                try {
                    const response = await fetch(searchUrl, { signal });
                    const data = await response.json();
                    return { items: data.items || [] };
                } catch (error) {
                    console.error("Failed to fetch from Custom Image Search API:", error);
                    return { error: `[Gặp lỗi khi kết nối tới dịch vụ tìm kiếm hình ảnh: ${error.message}]` };
                }
            }

            // Lấy URL của favicon từ một URL trang web
            function getFaviconUrl(url) {
                try {
                    const domain = new URL(url).hostname;
                    // Sử dụng dịch vụ của Google để lấy favicon, kích thước 32x32
                    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
                } catch (e) {
                    // Trả về một pixel trong suốt nếu URL không hợp lệ
                    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            }
            
            // Helper function to escape HTML
            function escapeHtml(unsafe) {
                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            
            // Function to read and process uploaded files
            async function readFile(file) {
                return new Promise((resolve, reject) => {
                    if (file.type.startsWith('image/')) {
                        if (file.size > 20 * 1024 * 1024) {
                            reject('Hình ảnh quá lớn (tối đa 20MB).');
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64 = reader.result.split(',')[1];
                            resolve({ type: 'image', base64, mimeType: file.type, url: URL.createObjectURL(file) });
                        };
                        reader.onerror = () => reject('Lỗi đọc hình ảnh');
                        reader.readAsDataURL(file);
                    } else if (file.type === 'text/plain') {
                        const reader = new FileReader();
                        reader.onload = () => resolve({ type: 'text', content: reader.result });
                        reader.onerror = () => reject('Lỗi đọc file TXT');
                        reader.readAsText(file);
                    } else if (file.type === 'application/pdf') {
                        const reader = new FileReader();
                        reader.onload = async () => {
                            try {
                                const pdf = await pdfjsLib.getDocument(reader.result).promise;
                                let text = '';
                                for (let i = 1; i <= pdf.numPages; i++) {
                                    const page = await pdf.getPage(i);
                                    const content = await page.getTextContent();
                                    text += content.items.map(item => item.str).join(' ') + '\n';
                                }
                                resolve({ type: 'text', content: text });
                            } catch (error) {
                                reject('Lỗi đọc file PDF');
                            }
                        };
                        reader.onerror = () => reject('Lỗi đọc file PDF');
                        reader.readAsArrayBuffer(file);
                    } else if (file.type === 'application/vnd.ms-powerpoint' || 
                              file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        const reader = new FileReader();
                        reader.onload = async () => {
                            try {
                                const zip = await JSZip.loadAsync(reader.result);
                                let text = '';
                                const slides = [];
                                const slideFiles = Object.keys(zip.files).filter(f => f.startsWith('ppt/slides/slide')).sort();
                                for (const slideFile of slideFiles) {
                                    const xml = await zip.file(slideFile).async('string');
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(xml, 'application/xml');
                                    const textNodes = doc.getElementsByTagName('a:t');
                                    let slideText = [];
                                    for (let i = 0; i < textNodes.length; i++) {
                                        const text = textNodes[i].textContent.trim();
                                        if (text) slideText.push(text);
                                    }
                                    text += slideText.join(' ') + '\n';
                                    const title = slideText[0] || `Slide ${slides.length + 1}`;
                                    const content = slideText.slice(1).join('\n') || 'Không có nội dung.';
                                    slides.push({ title, content });
                                }
                                resolve({ type: 'powerpoint', content: text.trim(), slides: slides.slice(0, 10) });
                            } catch (error) {
                                reject('Lỗi đọc file PowerPoint');
                            }
                        };
                        reader.onerror = () => reject('Lỗi đọc file PowerPoint');
                        reader.readAsArrayBuffer(file);
                    } else {
                        reject('Định dạng file không hỗ trợ');
                    }
                });
            }
            
            // Function to format file size
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
            
            // Handle new chat button
            newChatBtn.addEventListener('click', function() {
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }
                
                // Clear chat messages
                const messages = document.querySelectorAll('.message');
                messages.forEach(msg => msg.remove());
                const panels = document.querySelectorAll('.ai-panel-content');

                // Clear chat history and reset UI
                chatHistory = [];
                uploadedFile = null;
                
                // Show empty state
                if (emptyState) {
                    emptyState.style.display = 'flex';
                }
                
                // Hide typing indicator if visible
                typingIndicator.style.display = 'none';
                
                currentConversationId = null;
                renderChatHistorySidebar();

                // Reset input
                messageInput.value = '';
                sendBtn.disabled = true;
            });
            
            // --- Conversation Management ---
            function saveConversations() {
                localStorage.setItem('starx_chat_conversations', JSON.stringify(conversations));
            }

            function loadConversations() {
                const savedConversations = localStorage.getItem('starx_chat_conversations');
                if (savedConversations) {
                    conversations = JSON.parse(savedConversations);
                }
                renderChatHistorySidebar();
                
                // Đã vô hiệu hóa việc tự động tải cuộc trò chuyện gần nhất khi khởi động.
            }

            function getRelativeDateGroup(timestamp) {
                const now = new Date();
                const date = new Date(timestamp);
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (date >= today) {
                    return "Hôm nay";
                } else if (date >= yesterday) {
                    return "Hôm qua";
                } else {
                    // Format as DD / MM / YYYY
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day} / ${month} / ${year}`;
                }
            }

            function renderChatHistorySidebar() {
                chatHistoryContainer.innerHTML = '';
                conversations.sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent

                if (conversations.length === 0) {
                    chatHistoryContainer.innerHTML = '<p style="padding: 16px; color: var(--text-secondary); font-size: 14px; text-align: center;">Chưa có cuộc trò chuyện nào.</p>';
                    return;
                }

                const groupedConversations = conversations.reduce((groups, convo) => {
                    const groupName = getRelativeDateGroup(convo.timestamp);
                    if (!groups[groupName]) {
                        groups[groupName] = [];
                    }
                    groups[groupName].push(convo);
                    return groups;
                }, {});

                for (const groupName in groupedConversations) {
                    const groupHeader = document.createElement('div');
                    groupHeader.className = 'history-group-header';
                    groupHeader.textContent = groupName;
                    chatHistoryContainer.appendChild(groupHeader);

                    groupedConversations[groupName].forEach(convo => {
                        const item = document.createElement('div');
                        item.className = 'chat-item';
                        item.dataset.id = convo.id;
                        if (convo.id === currentConversationId) {
                            item.classList.add('active');
                        }

                        const aiRenameButton = !convo.isNamedByAI ? `
                            <button class="chat-item-btn ai-rename-btn" title="Đặt tên bằng AI">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707V11.5z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 1.5L14 6H9.5V1.5z"/></svg>
                            </button>
                        ` : '';

                        item.innerHTML = `
                            <span class="chat-item-title">${escapeHtml(convo.title)}</span>
                            <div class="chat-item-actions">
                                ${aiRenameButton}
                                <button class="chat-item-btn rename-btn" title="Đổi tên">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
                                </button>
                                <button class="chat-item-btn delete-btn" title="Xóa">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                </button>
                            </div>
                        `;

                        item.addEventListener('click', (e) => {
                            // Prevent loading conversation if a button was clicked
                            if (!e.target.closest('.chat-item-btn')) {
                                loadConversation(convo.id);
                            }
                        });
                        chatHistoryContainer.appendChild(item);
                    });
                }
            }

            function loadConversation(id) {
                const convoToLoad = conversations.find(c => c.id === id);
                if (!convoToLoad) return;

                currentConversationId = id;
                chatHistory = convoToLoad.messages;

                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }

                // Clear UI
                chatContainer.innerHTML = ''; // Clear all messages and panels
                chatContainer.appendChild(typingIndicator); // Re-add typing indicator
                chatContainer.appendChild(fileStatusIndicator); // Re-add file status indicator
                
                if (emptyState) {
                    emptyState.style.display = 'none';
                }

                // Render messages from the loaded conversation
                chatHistory.forEach(msg => {
                    if (msg.panel) {
                        const panelNode = renderPanelFromData(msg.panel);
                        if (panelNode) {
                            chatContainer.insertBefore(panelNode, typingIndicator);
                        }
                    } else if (msg.role === 'model' || msg.role === 'user') {
                        // Simplified rendering for history, assuming text only for now
                        // The `addMessage` function can be adapted if file previews are needed in history.
                        // For now, we only render text parts.
                        const content = msg.parts.filter(p => p.text).map(p => p.text).join(' ');
                        // We don't render file previews from history for now to keep it simple.
                        // A more complex implementation would handle `inline_data` etc.
                        addMessage(msg.role === 'model' ? 'ai' : 'user', content);
                    }
                });

                renderChatHistorySidebar();
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            function renderPanelFromData(panelData) {
                let panel;
                const isCollapsed = panelData.isCollapsed;

                switch (panelData.type) {
                    case 'search':
                        panel = createSearchPanel();
                        panel.querySelector('.search-panel-header h3').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất tìm kiếm`;
                        panel.querySelector('.step-1-header').innerHTML = `Bước 1: Kết quả cho "<strong>${escapeHtml(panelData.refinedQuery)}</strong>"`;
                        
                        const resultsContainer = panel.querySelector('.search-results-content');
                        const allResults = panelData.results || [];
                        const displayCount = 3;

                        allResults.slice(0, displayCount).forEach(item => {
                            resultsContainer.appendChild(renderSearchResultItem(item));
                        });

                        if (allResults.length > displayCount) {
                            const remainingCount = allResults.length - displayCount;
                            const moreBtn = document.createElement('button');
                            moreBtn.className = 'more-results-btn';
                            moreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Xem thêm ${remainingCount} kết quả`;
                            moreBtn.addEventListener('click', () => {
                                resultsSidebarContent.innerHTML = '';
                                allResults.slice(displayCount).forEach(item => {
                                    resultsSidebarContent.appendChild(renderSearchResultItem(item));
                                });
                                resultsSidebar.classList.add('visible');
                            });
                            resultsContainer.appendChild(moreBtn);
                        }
                        break;

                    case 'deep-think':
                        panel = createDeepThinkPanel();
                        panel.querySelector('.deep-think-header h3').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất suy nghĩ`;
                        const thoughtContainer = panel.querySelector('.thought-process-content');
                        // Render lại nội dung nháp với Markdown
                        const draftContent = panelData.draft || `<div class="thought-step">...</div>`;
                        thoughtContainer.innerHTML = processMarkdown(draftContent);
                        postProcessRenderedContent(thoughtContainer);
                        break;

                    case 'combined':
                        panel = createCombinedPanel();
                        panel.querySelector('.deep-think-header h3').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất`;
                        
                        const combinedSearchContainer = panel.querySelector('.search-results-content');
                        (panelData.searchResults || []).slice(0, 5).forEach(item => {
                            combinedSearchContainer.appendChild(renderSearchResultItem(item));
                        });

                        const combinedThoughtContainer = panel.querySelector('.thought-process-content');
                        combinedThoughtContainer.innerHTML = `<div class="thought-step"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <span>Đã hoàn thành quá trình tìm kiếm và suy nghĩ (${panelData.mode}).</span></div>`;
                        break;

                    case 'research':
                        panel = createResearchPanel();
                        panel.querySelector('.deep-think-header h3').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Đã hoàn tất nghiên cứu`;
                        
                        const step1 = panel.querySelector('.step-1-content');
                        const step2 = panel.querySelector('.step-2-content');
                        const step3 = panel.querySelector('.step-3-content');
                        const step4 = panel.querySelector('.step-4-content');

                        addThoughtStep(step1, `Tìm thấy ${(panelData.searchResults || []).length} kết quả cho chủ đề "${panelData.topic}".`);
                        addThoughtStep(step2, "Tổng hợp thông tin thành công.");
                        
                        const gallery = document.createElement('div');
                        gallery.className = 'research-image-gallery';
                        (panelData.imageUrls || []).forEach(url => {
                            gallery.innerHTML += `<img src="${url}" class="research-image-thumbnail" alt="Hình ảnh minh họa">`;
                        });
                        step3.innerHTML = '';
                        step3.appendChild(gallery);
                        addThoughtStep(step3, `Tìm thấy ${(panelData.imageUrls || []).length} hình ảnh phù hợp.`);

                        addThoughtStep(step4, "Soạn thảo báo cáo cuối cùng thành công.");
                        break;

                    default:
                        return null;
                }

                if (panel) {
                    const timer = panel.querySelector('.deep-think-timer');
                    if (timer) timer.style.display = 'none';

                    if (isCollapsed) {
                        const toggleBtn = panel.querySelector('.panel-toggle-btn');
                        const panelBody = panel.querySelector('.panel-body');
                        toggleBtn?.classList.add('collapsed');
                        panelBody?.classList.add('collapsed');
                    }
                }

                return panel;
            }

            function handleDeleteConversation(convoId) {
                showConfirmationModal(
                    'Xóa cuộc trò chuyện',
                    'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không? Hành động này không thể hoàn tác.',
                    'Xóa',
                    () => {
                        conversations = conversations.filter(c => c.id !== convoId);
                        saveConversations();

                        if (currentConversationId === convoId) {
                            newChatBtn.click();
                        } else {
                            renderChatHistorySidebar();
                        }
                    }
                );
            }

            function handleRenameConversation(convoId, chatItem) {
                const titleSpan = chatItem.querySelector('.chat-item-title');
                const currentTitle = titleSpan.textContent;
                chatItem.classList.add('editing');

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'chat-item-input';
                input.value = currentTitle;

                titleSpan.replaceWith(input);
                input.focus();
                input.select();

                const saveRename = () => {
                    const newTitle = input.value.trim();
                    if (newTitle && newTitle !== currentTitle) {
                        const convo = conversations.find(c => c.id === convoId);
                        if (convo) {
                            convo.title = newTitle;
                            saveConversations();
                        }
                    }
                    renderChatHistorySidebar();
                };

                input.addEventListener('blur', saveRename);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        saveRename();
                    } else if (e.key === 'Escape') {
                        renderChatHistorySidebar();
                    }
                });
            }
            
            async function handleRenameByAI(convoId, chatItem) {
                const convo = conversations.find(c => c.id === convoId);
                if (!convo || convo.messages.length === 0) {
                    showAlertModal("Lỗi", "Không thể đặt tên cho cuộc trò chuyện trống.");
                    return;
                }

                isRenamingByAI = true;
                const originalTitle = chatItem.querySelector('.chat-item-title').innerHTML;
                chatItem.querySelector('.chat-item-title').innerHTML = '<i>AI đang đặt tên...</i>';
                const actionButtons = chatItem.querySelector('.chat-item-actions');
                actionButtons.style.opacity = 0;

                try {
                    const newTitle = await getAiChatTitle(convo.messages);
                    if (newTitle) {
                        convo.title = newTitle;
                        convo.isNamedByAI = true;
                        saveConversations();
                        renderChatHistorySidebar();
                    } else {
                        chatItem.querySelector('.chat-item-title').innerHTML = originalTitle; // Restore on failure
                    }
                } catch (error) {
                    console.error("AI renaming failed:", error);
                    showAlertModal("Lỗi", "AI không thể đặt tên vào lúc này. Vui lòng thử lại sau.");
                    chatItem.querySelector('.chat-item-title').innerHTML = originalTitle;
                } finally {
                    isRenamingByAI = false;
                    actionButtons.style.opacity = ''; // Restore default behavior
                }
            }

            // Focus input when clicking on empty state (mobile)
            if (emptyState) {
                emptyState.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        messageInput.focus();
                    }
                });
            }

            // Theme switcher
            function setTheme(theme) {
                if (theme === 'dark') {
                    document.body.classList.add('dark-mode');
                    hljsLightTheme.disabled = true;
                    hljsDarkTheme.disabled = false;
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    hljsLightTheme.disabled = false;
                    hljsDarkTheme.disabled = true;
                    localStorage.setItem('theme', 'light');
                }
            }

            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = localStorage.getItem('theme') || 'light';
                if (currentTheme === 'light') {
                    setTheme('dark');
                } else {
                    setTheme('light');
                }
            });

            // Apply saved theme on load
            const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
            setTheme(savedTheme);

            // Load user profile and chat history from localStorage on startup
            loadUserProfile();
            loadConversations();
        });