### Instructions and Guidelines:

1. This is a group assignment that is to be handed in by **31st Aug 2025, 2359h** for both Assignment 1 and 2.

2. Group size should be either 2 or 3.

3. You are required to push your changes to your team's GitHub repository before the deadline.

4. The final commit on **master/main** branch before the deadline will be used as submission for Assignment 1. **Any commits in other branches or after the deadline will not be considered.**

5. All your commits and pull requests to GitHub repository created before the deadline will be used towards your Assignment 2

6. The presentation will be conducted during an interview session on the week of **1st Sep 2025**. No marks will be awarded if the work is copied or if you are absent from the presentation.

7. 5 marks to be deducted per working day late, up to a maximum deduction of 25 marks.

8. Non acceptance of assignments that are submitted any later than 31st Aug 2025 2359h and 0 marks will be given.

---

# Electronic Goods System

## Task Scenario
Upon the development of the Front end website (WDF), and backend functionalities (BDD), to complete the system, the Front end needs to be integrated with the Backend functionalites.

Visitors will be able to interact with your website (via the front end UI) and carry out actions which is handled by the back end. For this to happen, your Front end website will need to call your back end functionalites, and subsequnetly handle/process the response from your back end.

## Assignment 1 – Fullstack Development

### Minimum Requirements

Each member should minimally pick one of the tasks listed below, the rule of thumb is that each member should minimally work on 2-3 sub-features that involves the integration of Website, Server, and Database. For example (not exhaustive):
1. Add and Update Items
2. List Items and Delete Items
3. Login & Register of Admins

For simplicity, and to reduce merge conflicts, it is acceptable if each individual feature is in a separate page.

### Possible Directory structure for assignment:
```
server
├── src
│   ├── controllers
│   │   ├── xController.js
│   │   ├── yController.js
│   │   ├── zController.js
│   ├── models
│   │   ├── xModel.js
│   │   ├── yModel.js
│   │   ├── zModel.js
│   ├── routes
│   │   ├── mainRoutes.js
│   │   ├── xRoutes.js
│   │   ├── yRoutes.js
│   │   ├── zRoutes.js
│   ├── services
│   │   ├── db.js
│   ├── app.js
├── .gitignore
├── package.json
├── index.js
website
└── src/
    ├── components/
    ├── contexts/
    │   └── add_item.context.js
    └── hooks/
        └── use-item.js
… and so on
```

### Database Structure
You can simply reuse the database structure from your BDD assignment

### Advanced Features

There are some possible enhancements to the project that you can consider **only after you have completed the minimum requirements**. You can also have your own enhancements. Highlight any additional features in your presentation and report. **Enhancements should minimally affect both the Website and Server**

1. Logging of item record before updating 
   - and showing change history in a page on the website
2. Sorting of displayed items by user specified criteria such as price 
   - and allowing users to sort the table on the website
3. Uploading of item images to server hard disk 
   - and displaying it on the website
4. Create a checkbox to filter type of item listing 
   - and create an endpoint in the server to fetch the appropriate records from backend (i.e., filtering is done in backend and not frontend)

## Assignment 2 – Usage of Git

You are to collaborate with your team members using Git, to maintain your versions and integrating with your team members. Basically, you are to
1. Create branches – Each feature should have a branch for itself
2. Create commits – Each feature should have several small and meaningful commits with meaningful commit descriptions.
3. Create pull requests to merge into main branch – Each feature/key change should be concluded by 1 pull request.
4. Sync your local copy with GitHub, and resolving conflicts (if any)
5. Repeat the above steps several times to create a full stack web application with various features.

---

## Assessment

The project will be assessed based on the following criteria:

1. **Ability to demonstrate the required functionality for the project specification based on (85 marks):**
   • Presentation and demonstration
   • Explanation of code logic
   • Code implementation
   • Proper interaction between website, server, and database
   • Correctness

2. **Implementation of advanced features (15 marks)**
   • Creativity and effectiveness of advanced features

**Use of Git for collaboration will be assessed based on**
1. Adherence to the flow
2. Use of branches
3. Use of commits
4. Use of pull requests
5. Integrating changes

---
