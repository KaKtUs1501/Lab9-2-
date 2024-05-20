const registerTabButton = document.getElementById('register-button');
const loginTabButton = document.getElementById('login-button');
const registerTabPage = document.getElementById('register-form');
const loginTabPage = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const auth = document.getElementById('auth')
const loader = document.getElementById('loader');
const registerSubmitButton = document.getElementById('register-submit-button')
const activeTabButtonStyle = 'auth-head__button_active';
let currentPage = 1;
let usersPerPage = 16;
const baseRandomPersonApiUrl = "https://randomuser.me/api/";
const users = [];
let queriedUsers = [];
let isViewingUsers = false;
let activeUser = '';
let currentSearchOption = '';
let currentSearchQuery = '';
let currentSortOption = '';
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const changeTab = (event) => {
    switch (event.target.id) {
        case "register-button":
            registerTabButton.classList.add(activeTabButtonStyle);
            loginTabButton.classList.remove(activeTabButtonStyle);
            break;
        case 'login-button':
            loginTabButton.classList.add(activeTabButtonStyle);
            registerTabButton.classList.remove(activeTabButtonStyle);
            break;
    }

    const changeAuthPage = (tabName) => {
        switch (tabName) {
            case "register-button":
                registerTabPage.style.display = 'block';
                loginTabPage.style.display = 'none';
                break;
            case "login-button":
                loginTabPage.style.display = "block";
                registerTabPage.style.display = "none";
                break;
        }
    };

    changeAuthPage(event.target.id);
}


const validateForm = (id) => {
    const form = document.forms[id];
    if (form === null) return;

    const isValid = form.checkValidity();

    if (id === 'register-form') {
        const first = document.getElementById('password');
        const second = document.getElementById('confirmPassword');

        if (first.value !== second.value) {
            second.setCustomValidity("'Password' and 'Confirm Password' must match");
        } else {
            second.setCustomValidity('');
        }
    }
    const showValidationErrorsMessages = (invalidForm) => {
        for (let elem of invalidForm.elements) {
            const place = document.getElementById(`${elem.id}-validation`);
            if (elem.dataset.touched === 'true' && elem.validationMessage) {
                place.innerHTML = elem.validationMessage;
                elem.classList.add('register-form-field__input_invalid');
            } else if (elem.dataset.touched === 'true' && elem.validationMessage === '') {
                elem.classList.remove('register-form-field__input_invalid');
                elem.classList.add('register-form-field__input_valid');
                place.innerHTML = '';
            }
        }
    };

    if (!isValid) {
        showValidationErrorsMessages(form);
    }
};

const setInputTouched = (event) => {
    document.getElementById(event.target.id).dataset.touched = 'true';
    validateForm('register-form')
};

const togglePassword = (id) => {
    const input = document.getElementById(id);
    const eye = document.getElementById(`show-${id}`);

    if (input.type === 'password') {
        input.type = 'text';
        eye.className = 'fa-solid fa-eye-slash fa'
    } else {
        input.type = 'password';
        eye.className = 'fa-solid fa-eye fa'
    }
}

const showWelcome = (username) => {
    const welcomeDiv = document.getElementById('header-welcome');
    const welcomeSpan = document.getElementById('welcome-username');
    activeUser = username;
    welcomeDiv.style.visibility = 'visible';
    welcomeSpan.innerHTML = username;

    const bs = document.getElementsByClassName('welcome-to-page')[0];

    auth.style.display = 'none';
    bs.style.display = "block";
};

const saveUserToLocalStorage = (user) => {
    localStorage.setItem(user.username, JSON.stringify(user));

    const currentSignedUser = {
        username: user.username,
    };

    localStorage.setItem("currentSignedUser", JSON.stringify(currentSignedUser));
};

const deleteCurrentSignedInUser = () => {
    localStorage.removeItem("currentSignedUser");
};

const register = (event) => {
    event.preventDefault();
    auth.style.display = 'none';
    loader.style.display = 'block';
    const formData = new FormData(registerForm);
    const user = Object.fromEntries(formData.entries());
    console.log(user)
    const registration = new Promise((resolve, reject) => {
        const number = Math.random();
        if (number >= 0.5) {
            saveUserToLocalStorage(user);
            registerForm.reset();
            setTimeout(() => resolve("Registration successful"), 3000);
        } else {
            setTimeout(() => reject("Registration failed"), 3000)
        }
    })

    registration
        .then(result => {
            alert(result);
            auth.style.display = 'block';
            loader.style.display = 'none';
            document.getElementById('find-person-opt').style.display = 'block';
            showWelcome(user.username);
        })
        .catch(error => {
            alert(error);
            auth.style.display = 'block';
            loader.style.display = 'none';
        })
        .finally(() => console.log("Closing connection to server and cleaning up resources"));

    const data = new FormData(registerForm);
    console.log(data);
}


registerForm.onreset = (event) => {
    const inputs = document.getElementsByClassName("register-form-field__input");
    for (let input of inputs) {
        input.classList.remove("register-form-field__input_valid");
    }
}


const login = (event) => {
    event.preventDefault();
    auth.style.display = 'none';
    loader.style.display = 'block';
    const data = new FormData(event.target);

    const user = Object.fromEntries(data.entries());
    const login = new Promise((resolve, reject) => {
        const savedUser = localStorage.getItem(user.username);
        if (savedUser && JSON.parse(savedUser).password === user.password) {
            loginForm.reset();
            setTimeout(() => {
                resolve("Login successful");
            }, 1500)
        } else {
            setTimeout(() => {
                reject("No such user");
            }, 1500)
        }
    });

    login
        .then(result => {
            alert(result);
            auth.style.display = 'block';
            loader.style.display = 'none';
            document.getElementById('find-person-opt').style.display = 'block';
            showWelcome(user.username);
        })
        .catch(error => {
            alert(error);
            auth.style.display = 'block';
            loader.style.display = 'none';
        });

}

const logout = () => {
    if(activeUser){
        const welcome = document.getElementById('header-welcome');
        welcome.style.visibility = 'hidden';

        document.getElementById('welcome-to-page').style.display = 'none';
        document.getElementById('find-person').style.display = 'none';
        document.getElementById('find-person-body').style.display = 'none';
        document.getElementById('find-person-opt').style.display = 'none';
        auth.style.display = 'block';
    }
};

const loadUsers = async () => {
    console.log(`sending request with page ${currentPage}`)
    const response = await fetch(`${baseRandomPersonApiUrl}?page=${currentPage++}&results=${usersPerPage}&inc=name,dob,location,email,phone,picture,registered,age`);
    if(response.ok) {
        const json = await response.json();
        users.push(...json.results);
        console.log(users);
    }

    return Promise.resolve('success');
};

const renderUsers = () => {
    const resultDiv = document.getElementById('find-person-body');
    resultDiv.innerHTML = '';
    const createParentUserDiv = () => {
        const div =  document.createElement('div');
        div.className = 'user';
        return div;
    };


    const createUserPhoto = (user) => {
        const image = document.createElement('img');
        image.src = user.picture.large;
        return image;
    };



    const createUserDataDiv = (user) => {
        const div = document.createElement('div');
        div.className = 'user-data';

        const img = document.createElement('img');
        img.src = user.picture.large; 
        img.alt = `Profile picture of ${user.name.first} ${user.name.last}`;
        img.className = 'user-data-img'; 
        div.appendChild(img);

        const fields = [
            { label: 'Name', value: `${user.name.first} ${user.name.last}` },
            { label: 'Age', value: user.dob.age },
            { label: 'Phone', value: user.phone },
            { label: 'Email', value: user.email },
            { label: 'City', value: user.location.city },
            { label: 'Registered', value: new Date(user.registered.date).toDateString() },
        ];

        fields.forEach(({ label, value }) => {
            const p = document.createElement('p');
            p.textContent = `${label}: ${value}`;
            div.appendChild(p);
        });

        return div;
    };



    for (let user of queriedUsers.slice(0, usersPerPage * currentPage)) {
        const parentDiv = createParentUserDiv();
        const photo = createUserPhoto(user);
        const dataDiv = createUserDataDiv(user);
        parentDiv.appendChild(dataDiv);
        resultDiv.appendChild(parentDiv);
    }

};

const load5000Users = async () => {
    const response = await fetch(`${baseRandomPersonApiUrl}?results=5000&inc=name,dob,location,email,phone,picture,registered,age`)

    if(response.ok){
        const body = await response.json();
        users.push(...body.results);
        queriedUsers.push(...users);
    }
};
const findPerson = () => {
    document.getElementById('welcome-to-page').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    document.getElementById('find-person').style.display = 'none';

    setTimeout(() => {
        load5000Users().then(r => {
            document.getElementById('find-person-body').style.display = 'flex';
            document.getElementById('loader').style.display = 'none';
            document.getElementById('find-person').style.display = 'block';
            renderUsers();
            isViewingUsers = true;
        });
    }, 300); 
};


const searchPerson = (event) => {
    event.preventDefault();
    currentPage = 1;

    const searchForm = document.getElementById('search-form');
    const data = Object.fromEntries((new FormData(searchForm)).entries());
    console.log('Form data:', data); 
    const {searchOption, searchQuery, sortOption} = data;

    currentSearchOption = searchOption;
    currentSearchQuery = searchQuery;
    currentSortOption = sortOption;

    updateURL();

    switch (searchOption) {
        case 'name':
            queriedUsers = users.filter(u => (`${u.name.first} ${u.name.last}`).toLowerCase().includes(searchQuery.toLowerCase()));
            break;
        case 'age':
            console.log('Search query:', searchQuery); 
            if (!searchQuery) {
                alert("Please enter an age value");
                return;
            }
            const age = parseInt(searchQuery);
            console.log('Parsed age:', age); 
            if (isNaN(age)) {
                alert("Incorrect age value");
                return;
            }
            queriedUsers = users.filter(u => u.dob.age === age);
            break;
        case 'email':
            queriedUsers = users.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()));
            break;
        case 'city':
            queriedUsers = users.filter(u => u.location.city.toLowerCase().includes(searchQuery.toLowerCase()));
            break;
        default:
            queriedUsers = users;
            break;
    }

    switch (sortOption) {
        case 'name':
            queriedUsers.sort((a, b) => `${a.name.first} ${a.name.last}`.localeCompare(`${b.name.first} ${b.name.last}`));
            break;
        case 'age':
            queriedUsers.sort((a, b) => a.dob.age - b.dob.age);
            break;
        case 'registration-date':
            queriedUsers.sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
            break;
    }
    console.log(queriedUsers);
    renderUsers();
};

    
    const resetSearch = (event) => {
        event.preventDefault();
        currentPage = 1;
        queriedUsers = [...users];
        renderUsers();
    };
    
    registerTabButton.click();
    validateForm('register-form');
    const handleInfiniteScroll = () => {
        console.log('here')
        console.log(isViewingUsers);
        if(isViewingUsers){
            const isBottom = document.documentElement.clientHeight + window.scrollY + 100 >=
                (document.documentElement.scrollHeight ||
                    document.documentElement.clientHeight);
    
            console.log(isBottom)
            if(isBottom){
                currentPage++;
                console.log(currentPage);
                renderUsers();
            }
        }
    };
    
    window.addEventListener('scroll', handleInfiniteScroll)
    
    const searchWithDebounce = debounce(searchPerson, 300);
    
    document.getElementById('search-form').addEventListener('input', searchWithDebounce);
    
    const updateURL = () => {
        const params = new URLSearchParams();
        params.set('searchOption', currentSearchOption);
        params.set('searchQuery', currentSearchQuery);
        params.set('sortOption', currentSortOption);
        const queryString = params.toString();
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString}`;
        window.history.pushState({}, '', newUrl);
    };
    
    const getSearchParamsFromURL = () => {
        const searchParams = new URLSearchParams(window.location.search);
        currentSearchOption = searchParams.get('searchOption') || '';
        currentSearchQuery = searchParams.get('searchQuery') || '';
        currentSortOption = searchParams.get('sortOption') || '';
        document.getElementById('search-option').value = currentSearchOption;
        document.getElementById('search-query').value = currentSearchQuery;
        document.getElementById('sort-option').value = currentSortOption;
    };
    
    window.addEventListener('load', () => {
        getSearchParamsFromURL();
        searchPerson(new Event('search'));
    });
    
