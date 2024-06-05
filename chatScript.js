// object format ==> {channelID : channel}
let channelMap = {};
let activeChannelID ='';

const messageDisplay = document.getElementById('messageDisplay');
const sendButton = document.querySelector("#sendButton");
const textContainer = document.querySelector("#textMessage");
const userName = document.querySelector("#userName");
const channelList = document.querySelector("#activeChannels");
const addChannelPopup = document.querySelector("#addChannelPopup");
const confirmAddChannel = document.querySelector("#confirmAddChannel");
const addChannelButton = document.querySelector("#addChannel");
const newChannelName = document.querySelector("#newChannelName");
const newChannelID = document.querySelector("#newChannelID");
const channelNameDisplay = document.querySelector("#channelNameDisplay");
const addAlert = document.querySelector("#addAlert");
const exitAddChannel = document.querySelector("#exitAddChannel");

class user
{
    userID = '';
    constructor(userID)
    {
        this.userID = userID;
    }
};

let userInformation = new user(sessionStorage.getItem('userID'));
userName.textContent = userInformation.userID;

class Message
{
    messageContent = '';
    senderID = '';
    constructor(messageContent, senderID)
    {
        this.messageContent = messageContent;
        this.senderID = senderID;
    }
    addToChannel(channelID)
    {
        channelMap[channelID].ChannelMessages.push(this);
    }
    displayMessage()
    {
        const messageHTML = document.createElement("div");
        messageHTML.classList.add("Message");

        if (this.senderID === userInformation.userID)
            messageHTML.classList.add("user");
        else
            messageHTML.classList.add("sender");

        const senderDetails = document.createElement("div");
        senderDetails.classList.add("userIdDisplay");
        senderDetails.textContent = this.senderID;
        messageHTML.appendChild(senderDetails);

        const messageContent = document.createTextNode(this.messageContent);
        messageHTML.appendChild(messageContent);

        messageDisplay.appendChild(messageHTML);
    }

    static displayAllMessages(channelID)
    {
        messageDisplay.innerHTML = '';
        let currentMessageList = channelMap[activeChannelID].ChannelMessages;
        for (let i = 0; i < currentMessageList.length; i++)
            currentMessageList[i].displayMessage();
    }
};

class channel
{
    channelName = '';
    channelID = '';
    ChannelMessages = [];
    constructor(channelName, channelID)
    {
        this.channelName = channelName;
        this.channelID = channelID;
    }
};

function generateKey(channelName, channelID)
{
    return channelName + '-#!' + channelID;
}

exitAddChannel.addEventListener('click', () => {
    addChannelPopup.style.display = 'none';
});

function addChannelToList()
{
    channelToAddName = newChannelName.value.trimRight();
    channelToAddID = newChannelID.value.trimRight();

    if (channelToAddName === '' || channelToAddID === '')
    {
        addAlert.style.backgroundColor = 'black';
        addAlert.style.padding = '1%';
        addAlert.style.color = 'white';
        addAlert.textContent = 'Null values not allowed';
        return;
    }

    const key = generateKey(channelToAddName, channelToAddID);

    if (channelMap[key])
    {
        addAlert.style.backgroundColor = 'red';
        addAlert.style.padding = '1%';
        addAlert.style.color = 'white';
        addAlert.textContent = 'Error! Duplicate Channel ID created';
        return;
    }

    const newChannel = new channel(channelToAddName, channelToAddID);
    // feed details to server

    // if confirmed from server

    channelMap[key] = newChannel;

    const channelButton = document.createElement("div");
    channelButton.classList.add("channelSelector");
    channelButton.id = key;

    const channelButtonText = document.createElement("div");
    channelButtonText.textContent = channelToAddName;

    const deleteChannelButton = document.createElement("button");
    deleteChannelButton.classList.add('deleteChannelButton');
    deleteChannelButton.textContent = 'Delete';


    deleteChannelButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (activeChannelID === channelButton.id) {
            messageDisplay.textContent = '';
            channelNameDisplay.textContent = '';
        }
        delete channelMap[channelButton.id];
        channelList.removeChild(channelButton);
    });

    channelButton.addEventListener('click', () => {
        activeChannelID = channelButton.id;
        channelNameDisplay.textContent = channelButtonText.textContent;
        Message.displayAllMessages(activeChannelID);
    });

    channelButton.appendChild(channelButtonText);
    channelButton.appendChild(deleteChannelButton);
    channelList.insertBefore(channelButton, addChannelButton);

    // remove addChannel popup from display
    newChannelName.value = '';
    newChannelID.value = '';
    addChannelPopup.style.display = 'none';
}

newChannelName.addEventListener('keydown', (event) => {
    if (event.which === 13)
        newChannelID.focus();
});

newChannelID.addEventListener('keydown', (event) => {
    if (event.which === 13)
        addChannelToList();
});

confirmAddChannel.addEventListener("click", () => addChannelToList());

addChannelButton.addEventListener("click", () => {
    addChannelPopup.style.display = 'flex';
});

const sendMessage = () => {
    if (textContainer.value != '' && activeChannelID != undefined)
    {
        console.log(activeChannelID);
        const currentChannel = channelMap[activeChannelID];
        const newInput = new Message(textContainer.value, userInformation.userID);
        newInput.addToChannel(activeChannelID);
        newInput.displayMessage();
        textContainer.value = null;
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }
}
    
textContainer.addEventListener("keydown", (event) => {
    if (event.which === 13) {
        event.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener("click", sendMessage);

textContainer.focus();