//@Parameter(name="requesterEmail") @RequestParam String requesterEmail,
//@Parameter(name="professorEmail") @RequestParam String professorEmail,
//@Parameter(name="explanation") @RequestParam String explanation,
//@Parameter(name="dateRequested", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
//@Parameter(name="dateNeeded", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded,
//@Parameter(name="done") @RequestParam boolean done

const recommendationRequestFixtures = {
    oneRecommendationRequest:
    {
        "id": 1,
        "requesterEmail": "benjaminconte@ucsb.edu",
        "professorEmail": "conrad@ucsb.edu",
        "explanation": "For applications for masters programs in computer science",
        "dateRequested": "2023-10-14T10:15:00",
        "dateNeeded": "2024-01-04T12:20:00",
        "done": false
    },

    threeRecommendationRequests:
    [
        {
            "id": 1,
            "requesterEmail": "chris@ucsb.edu",
            "professorEmail": "suri@ucsb.edu",
            "explanation": "For applications for PHD programs in computer science",
            "dateRequested": "2023-08-13T11:15:00",
            "dateNeeded": "2023-10-04T11:20:00",
            "done": true
        },

        {
            "id": 2,
            "requesterEmail": "luke@ucsb.edu",
            "professorEmail": "hardekopf@ucsb.edu",
            "explanation": "For job applications",
            "dateRequested": "2023-12-13T10:15:00",
            "dateNeeded": "2024-02-10T11:10:00",
            "done": false
        },

        {
            "id": 3,
            "requesterEmail": "sebastian@ucsb.edu",
            "professorEmail": "krintz@ucsb.edu",
            "explanation": "For research positions",
            "dateRequested": "2023-11-20T12:15:00",
            "dateNeeded": "2024-01-10T11:10:00",
            "done": false
        },
        
    ]
};

export { recommendationRequestFixtures };