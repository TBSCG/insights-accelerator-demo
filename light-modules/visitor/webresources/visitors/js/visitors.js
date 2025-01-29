let baseURL = window.location.href;
baseURL = baseURL.substring(0, baseURL.indexOf('/.resources'));
let visitorData = [];
let interestWeightLoaded = false;
$(document).ready(()=> {

    $( "#tabs" ).tabs();

    let userSelector = $('#userID');
    let siteSelector = $('#site');
    $("#dataContainer").hide();

    $.get(baseURL + '/.rest/ivisitor/v1', (data) => {
        visitorData = data;

        if ( visitorData.status === "Error" ) {
            userSelector.html("<option>Error loading</option>");
            siteSelector.html("<option>Error loading</option>");
            $( "#tabs" ).tabs( "option", "disabled", true );

            $("#tabs-1").html("<h3>Error loading Insights Accelerator</h3><div>Please contact your technical team for assistance</div><div class='error-message'>Error Message:<br/><em>" + visitorData.message + "</em></div>");
        } else if ( visitorData.length === 0 ) {
            userSelector.html("<option>Error loading</option>");
            siteSelector.html("<option>Error loading</option>");
        } else {
            userSelector.html("");
            userSelector.append(new Option("",""));
            let users = {};
            $.each(visitorData, (index, visitor) => {
                if ( ! users[visitor.visitorId] ) {
                    userSelector.append(new Option(visitor.visitorId, visitor.visitorId));
                    users[visitor.visitorId] = true;
                }
            });
            siteSelector.html("");
            siteSelector.append(new Option("",""));
            let sites = {};
            $.each(visitorData, (index, visitor) => {
                if ( ! sites[visitor.site] ) {
                    siteSelector.append(new Option(visitor.site, visitor.site));
                    sites[visitor.site] = true;
                }
            });
            loadOverview();
        }
    });

    $('#userID').change((item) => {
        // populate site based on user
        let filter = ( $(item.target).val() != "" );
        let currentlySelected = $('#site').val();
        siteSelector.html("");
        siteSelector.append(new Option("",""));
        let sites = {};
        $.each(visitorData, (index, visitor) => {
            if ( !filter || visitor.visitorId === $(item.target).val() ) {
                if ( ! sites[visitor.site] ) {
                    siteSelector.append(new Option(visitor.site, visitor.site, false, visitor.site === currentlySelected));
                    sites[visitor.site] = true;
                }
            }
        });
        loadData();
    });

    $('#site').change((item) => {
        // populate user based on site
        let filter = ( $(item.target).val() != "" );
        let currentlySelected = $('#userID').val();
        userSelector.html("");
        userSelector.append(new Option("",""));
        let users = {};
        $.each(visitorData, (index, visitor) => {
            if ( !filter || visitor.site === $(item.target).val() ) {
                if ( ! users[visitor.visitorId] ) {
                    userSelector.append(new Option(visitor.visitorId, visitor.visitorId, false, visitor.visitorId === currentlySelected));
                    users[visitor.visitorId] = true;
                }
            }
        });
        loadData();
    });

    $("#describeTheUser").click( () => {
        let url = baseURL + '/.rest/ivisitor/v1/describeUser?userId=' + $('#userID').val() + '&site=' + $('#site').val();
        $.get(url, (data) => {
            let html = "<p>" + data.userDescription.description + "</p>";
            html += "Potential segment: <em>" + data.userDescription.segment + "</em>";
            $("#userDescription").html(html);
        });
    });

    $("#interestCount").click( (evt) => {
        let isChecked = $(evt.target).is(":checked");
        if ( isChecked ) {
            $("#visitorWeight").hide();
            $("#visitorCount").show();
            if ( !interestWeightLoaded ) {
                loadVisitorCountChart();
                interestWeightLoaded = true;
            }
        } else {
            $("#visitorWeight").show();
            $("#visitorCount").hide();
        }
    });

    $("#removeSite").click( () => {
        let site = $('#site').val();
        let user = $('#userID').val();

        if ( site !== "" && user !== "" ) {
            let url = baseURL + '/.rest/ivisitor/v1/remove?userId=' + user + '&site=' + site;
            $.get(url, (data) => {
                location.reload();
            });
        }
    });
});

function loadOverview() {

    loadTotalCounts();
    loadInterestsSummaryTable();
    loadWeightChart();

}

function loadTotalCounts() {
    let sites = {};
    let visitors = {};
    let totalVisitors = visitorData.length;

    for ( let i = 0; i < totalVisitors; i++ ) {
        let visitor = visitorData[i];
        if ( sites[visitor.site] ) {
            sites[visitor.site] = sites[visitor.site] + 1;
        } else {
            sites[visitor.site] = 1;
        }
        if ( visitors[visitor.id] ) {
            visitors[visitor.id] = visitors[visitor.id] + 1;
        } else {
            visitors[visitor.id] = 1;
        }
    }

    $("#siteCountPanel").html(Object.keys(sites).length);
    $("#visitorCountPanel").html(Object.keys(visitors).length);
    $("#uniqueVisitorCount").html(totalVisitors);
}

function loadWeightChart() {
    let interestsWeight = {};

    for ( let i = 0; i < visitorData.length; i++ ) {
        let visitor = visitorData[i];
        for ( let j = 0; j < visitor.interestManager.interests.length; j++ ) {
            let tag = visitor.interestManager.interests[j].tag;
            if ( interestsWeight[tag] ) {
                interestsWeight[tag] = interestsWeight[tag] + visitor.interestManager.interests[j].weight;
            } else {
                interestsWeight[tag] = visitor.interestManager.interests[j].weight;
            }
        }
    }

    let xValues = [];
    let yValues = [];
    for ( let key in interestsWeight ) {
        xValues.push(key);
        yValues.push(interestsWeight[key]);
    }

    let weightChart = new Chart("interestsWeight", {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
                data: yValues,
            }]
        },
        options: {
            title: {
                display: true,
                text: "World Wide Wine Production"
            },
            responsive: true,
            pointLabel: {
                label: "label"
            },
            "plugins": {
                "legend": {
                    "display": true,
                    "position": "bottom",
                    "align": "start"
                }
            }
        }
    });
}

function loadVisitorCountChart() {
    let interestsVisitors = {};

    for ( let i = 0; i < visitorData.length; i++ ) {
        let visitor = visitorData[i];
        for ( let j = 0; j < visitor.interestManager.interests.length; j++ ) {
            let tag = visitor.interestManager.interests[j].tag;
            if ( interestsWeight[tag] ) {
                interestsVisitors[tag] = interestsVisitors[tag] + 1;
            } else {
                interestsVisitors[tag] = 1;
            }
        }
    }

    let xValues = [];
    let yValues = [];
    for ( let key in interestsVisitors ) {
        xValues.push(key);
        yValues.push(interestsVisitors[key]);
    }

    new Chart("interestsVisitors", {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
                data: yValues,
            }]
        },
        options: {
            title: {
                display: true,
                text: "World Wide Wine Production"
            },
            responsive: true,
            pointLabel: {
                label: "label"
            },
            "plugins": {
                "legend": {
                    "display": true,
                    "position": "bottom",
                    "align": "start"
                }
            }
        }
    });
}

function loadData() {
    $("#userDescription").html("");
    let id =$('#userID').val();
    let site =$('#site').val();
    console.log( "Loading data for: " + id + " at site: " + site );
    if ( id === "" || site === "" ) {
        // clear data
        $("#dataContainer").hide();
        if ( pollTimer != null ) {
            clearTimeout(pollTimer);
        }
    } else {
        $("#dataContainer").show();
        let selectedVisitor = getVisitorByIdAndSite(id,site);
        loadTagCloud(selectedVisitor);
        loadInterestsTable(selectedVisitor);
        loadRecentlyViewedTable(selectedVisitor);
        pollTimer = setTimeout( poll, pollFrequency, selectedVisitor );
    }
}

let pollTimer = null;
let pollFrequency = 5000; //1000
function poll(selectedVisitor) {
    $.get(baseURL + '/.rest/ivisitor/v1/visitor', { userId: selectedVisitor.visitorId, site: selectedVisitor.site }, (data) => {
        if ( selectedVisitor.updateTime !== data.updateTime ) {
            selectedVisitor = data;
            loadTagCloud(selectedVisitor);
            loadInterestsTable(selectedVisitor);
            loadRecentlyViewedTable(selectedVisitor);
        }
        pollTimer = setTimeout( poll, pollFrequency, selectedVisitor );
    });
}

function getVisitorByIdAndSite(visitorID,site) {
    let selectedVisitor = null;
    for ( let i = 0; i < visitorData.length; i++ ) {
        if ( visitorData[i].visitorId === visitorID && visitorData[i].site === site ) {
            selectedVisitor = visitorData[i];
            break;
        }
    }
    return selectedVisitor;
}

function loadTagCloud(selectedVisitor) {

    if ( selectedVisitor != null ) {
        let tags = [];
        for (let i = 0; i < selectedVisitor.interestManager.interests.length; i++) {
            let tag = {};
            tag.word = selectedVisitor.interestManager.interests[i].tag;
            tag.weight = selectedVisitor.interestManager.interests[i].weight;
            if (tag.word && tag.weight) {
                let newEntry = true;
                for (let j = 0; j < tags.length; j++) {
                    if (tags[j].word === tag.word) {
                        newEntry = false;
                        tags[j].weight = tags[j].weight + tag.weight;
                    }
                }
                if (newEntry) {
                    tags.push(tag);
                }
            }
        }
        $("#tagCloud").jQWCloud({
            words: tags,
            //cloud_color: 'yellow',
            minFont: 10,
            maxFont: 50,
            //fontOffset: 5,
            //cloud_font_family: 'Owned',
            verticalEnabled: true,
            padding_left: 1,
            //showSpaceDIV: true,
            //spaceDIVColor: 'red',
            word_common_classes: 'WordClass',
            word_mouseEnter: function () {
                $(this).css("text-decoration", "underline");
            },
            word_mouseOut: function () {
                $(this).css("text-decoration", "none");
            },
            word_click: function () {
                alert("You have selected:" + $(this).text());
            },
            beforeCloudRender: function () {
                date1 = new Date();
            },
            afterCloudRender: function () {
                var date2 = new Date();
                console.log("Cloud Completed in " + (date2.getTime() - date1.getTime()) + " milliseconds");
            }
        });
    }
}

function loadInterestsTable(selectedVisitor) {

    let dataArray = selectedVisitor.interestManager.interests;

    if (!$.fn.dataTable.isDataTable('#interests')) {
        window.interestsTable = new DataTable('#interests', {
            data: dataArray,
            responsive: true,
            pageLength: 15,
            columns: [
                {data: 'tag'},
                {data: 'decayRate'},
                {data: 'weight'}
            ],
            order: [[2, 'desc']],
            layout: {
                topStart: {
                    buttons: [
                        'searchBuilder',
                        {
                            extend: 'showSelected',
                            text: 'Show Selected Only',
                        },
                        {
                            extend: 'excel',
                            text: 'Export as Excel',
                            title: "Insights Accelerator - Interests",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        },
                        {
                            extend: 'pdf',
                            text: 'Export as PDF',
                            orientation: 'landscape',
                            pageSize: 'TABLOID',
                            title: "Insights Accelerator - Interests",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        }
                    ]
                }
            },
            language: {
                searchBuilder: {
                    button: 'Filter'
                }
            },
            select: true
        });
    } else {
        $('#interests').DataTable().clear();
        $('#interests').DataTable().rows.add(dataArray);
        $('#interests').DataTable().draw();
    }
}

function loadInterestsSummaryTable() {

    let interestsWeight = {};

    for ( let i = 0; i < visitorData.length; i++ ) {
        let visitor = visitorData[i];
        for ( let j = 0; j < visitor.interestManager.interests.length; j++ ) {
            let tag = visitor.interestManager.interests[j].tag;
            if ( interestsWeight[tag] ) {
                interestsWeight[tag] = interestsWeight[tag] + visitor.interestManager.interests[j].weight;
            } else {
                interestsWeight[tag] = visitor.interestManager.interests[j].weight;
            }
        }
    }

    let dataArray = [];

    for ( let key in interestsWeight ) {
        let item = {};
        item.tag = key;
        item.weight = interestsWeight[key];
        dataArray.push(item);
    }

    if (!$.fn.dataTable.isDataTable('#interestsOverview')) {
        new DataTable('#interestsOverview', {
            data: dataArray,
            responsive: true,
            pageLength: 15,
            columns: [
                {data: 'tag'},
                {data: 'weight'}
            ],
            order: [[1, 'desc']],
            //columnDefs: [{ visible: false, targets: 2 }],
            layout: {
                topStart: {
                    buttons: [
                        'searchBuilder',
                        {
                            extend: 'showSelected',
                            text: 'Show Selected Only',
                        },
                        {
                            extend: 'excel',
                            text: 'Export as Excel',
                            title: "Insights Accelerator - Interests Overview",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        },
                        {
                            extend: 'pdf',
                            text: 'Export as PDF',
                            orientation: 'landscape',
                            pageSize: 'TABLOID',
                            title: "Insights Accelerator - Interests Overview",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        }
                    ]
                }
            },
            language: {
                searchBuilder: {
                    button: 'Filter'
                }
            },
            select: true
        });
    } else {
        $('#interestsOverview').DataTable().clear();
        $('#interestsOverview').DataTable().rows.add(dataArray);
        $('#interestsOverview').DataTable().draw();
    }
}

function loadRecentlyViewedTable(selectedVisitor) {

    let dataArray = selectedVisitor.recentlyViewed;

    if (!$.fn.dataTable.isDataTable('#recentlyViewed')) {
        new DataTable('#recentlyViewed', {
            data: dataArray,
            responsive: true,
            pageLength: 5,
            columns: [
                {data: 'id'},
                {
                    data: 'cal',
                    render: function (data, type, row) {
                        let min = data.minute;
                        if (min < 10) {
                            min = "0" + min;
                        }
                        let sec = data.second;
                        if (sec < 10) {
                            sec = "0" + sec;
                        }
                        return `${data.dayOfMonth}/${data.month+1}/${data.year} ${data.hourOfDay}:${min}:${sec}`;
                    }
                }
            ],
            order: [[1, 'desc']],
            //columnDefs: [{ visible: false, targets: 2 }],
            layout: {
                topStart: {
                    buttons: [
                        'searchBuilder',
                        {
                            extend: 'showSelected',
                            text: 'Show Selected Only',
                        },
                        {
                            extend: 'excel',
                            text: 'Export as Excel',
                            title: "Insights Accelerator - Recently Viewed",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        },
                        {
                            extend: 'pdf',
                            text: 'Export as PDF',
                            orientation: 'landscape',
                            pageSize: 'TABLOID',
                            title: "Insights Accelerator - Recently Viewed",
                            exportOptions: {
                                modifier: {
                                    page: 'all',
                                    search: 'none'
                                }
                            }
                        }
                    ]
                }
            },
            language: {
                searchBuilder: {
                    button: 'Filter'
                }
            },
            select: true
        });
    } else {
        $('#recentlyViewed').DataTable().clear();
        $('#recentlyViewed').DataTable().rows.add(dataArray);
        $('#recentlyViewed').DataTable().draw();
    }
}