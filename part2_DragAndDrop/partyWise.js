(function () {
    window.onload = init;

    var senators = [];
    var members = [];

    function init() {
        // Check if data exists in local storage
        var senatorsData = localStorage.getItem("senators_LIN");
        var msg = document.getElementById("msg");

        if (senatorsData) {
            senators = JSON.parse(senatorsData);
            // Initialize the members array from the senators array
            members = senators.map(function (senator) {
                return {
                    name: senator.name,
                    draggable: true
                };
            });
            populateLists();
            msg.textContent = "from localStorage loaded 10 senators";
        } else {
            loadSenatorsFromXML();
            msg.textContent = "From AJAX loaded 10 senators";
        }

        // Set up event listeners for drop areas (Democrats and Republicans lists)
        var democratsList = document.getElementById("democrats");
        var republicansList = document.getElementById("republicans");

        democratsList.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        democratsList.addEventListener("drop", function (e) {
            dropHandler(e, "Democrat");
        });

        republicansList.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        republicansList.addEventListener("drop", function (e) {
            dropHandler(e, "Republican");
        });

        // Set up event listeners for drag-and-drop events
        var membersList = document.getElementById("members");
        membersList.addEventListener("dragstart", dragStartHandler);
        membersList.addEventListener("dragend", function () {
            msg.textContent = "Drag ended";
        });

        // Prevent members who have already voted from being dragged
        for (var i = 0; i < members.length; i++) {
            var memberName = members[i].name;
            var isVoted = isMemberVoted(memberName);
            members[i].draggable = !isVoted;
        }
    }

    function populateLists() {
        var democratsList = document.getElementById("democrats");
        var republicansList = document.getElementById("republicans");
        var membersList = document.getElementById("members");

        // Clear the lists
        democratsList.innerHTML = "";
        republicansList.innerHTML = "";
        membersList.innerHTML = "";

        senators.forEach(function (senator) {
            var senatorElement = document.createElement("li");
            senatorElement.textContent = senator.name;
            senatorElement.draggable = true;
            senatorElement.addEventListener("dragstart", dragStartHandler);

            if (senator.voted) {
                // Add senators to their respective areas
                if (senator.party === "Democrat") {
                    democratsList.appendChild(senatorElement);
                } else if (senator.party === "Republican") {
                    republicansList.appendChild(senatorElement);
                }
            }
        });

        // Populate the "Members" list with color classes
        members.forEach(function (member) {
            var memberElement = document.createElement("li");
            memberElement.textContent = member.name;
            memberElement.draggable = true;
            memberElement.addEventListener("dragstart", dragStartHandler);

            if (isDemocrat(member.name)) {
                memberElement.classList.add("democrat");
            } else if (isRepublican(member.name)) {
                memberElement.classList.add("republican");
            }

            membersList.appendChild(memberElement);
        });
    }

    function dragStartHandler(e) {
        e.dataTransfer.setData("text/plain", e.target.textContent);
    }

    function dropHandler(e, party) {
        e.preventDefault();
        var senatorName = e.dataTransfer.getData("text/plain");

        var senator = senators.find(function (s) {
            return s.name === senatorName;
        });

        if (senator) {
            // Check if the senator is not already voted and is of the correct party
            if (!senator.voted && senator.party === party) {
                senator.voted = true;
                localStorage.setItem("senators_LIN", JSON.stringify(senators));
                populateLists();
            }
        }
    }

    function loadSenatorsFromXML() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var xmlDoc = xhr.responseXML;
                var senatorNodes = xmlDoc.querySelectorAll("senator");

                senators = Array.from(senatorNodes).map(function (node) {
                    return {
                        name: node.querySelector("name").textContent,
                        party: node.querySelector("party").textContent,
                        voted: false
                    };
                });

                // Initialize the members list with all senators
                members = senators.map(function (senator) {
                    return {
                        name: senator.name,
                        draggable: true
                    };
                });

                localStorage.setItem("senators_LIN", JSON.stringify(senators));
                populateLists();
            }
        };

        xhr.open("GET", "partyList.xml", true);
        xhr.send();
    }

    function isMemberVoted(name) {
        return senators.some(function (senator) {
            return senator.name === name && senator.voted;
        });
    }

    function isDemocrat(name) {
        return senators.some(function (senator) {
            return senator.name === name && senator.party === "Democrat";
        });
    }

    function isRepublican(name) {
        return senators.some(function (senator) {
            return senator.name === name && senator.party === "Republican";
        });
    }
})();
