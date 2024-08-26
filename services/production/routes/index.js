var express = require("express");
const users = require("../controllers/users");
const { json } = require("express/lib/response");
const post = require("../controllers/post");
const chat = require("../controllers/chat");
const { Server } = require("socket.io");
const savedPost = require("../controllers/savedPost");
const dispute = require("../controllers/dispute");
const proposal = require("../controllers/proposal");
const contract = require("../controllers/contract");
const form = require("../controllers/form");
const response = require("../controllers/response");
const question = require("../controllers/question");
const admin = require("../controllers/admin");
const review = require("../controllers/review");

var router = express.Router();


//User account Routes 
router.get("/users", (req, res) => users.getUsers(req, res));
router.get("/userById", (req, res) => users.getUserById(req, res));
router.get("/user", (req, res) => users.getUser(req, res));
router.post("/login", (req, res) => users.login(req, res));
router.post("/signup", (req, res) => users.signUp(req, res));
router.post("/user", (req, res) => users.addUser(req, res));
router.post("/addSkills", (req, res) => users.addSkills(req, res));
router.put("/user", (req, res) => users.updateUser(req, res));
router.put("/updatePassword", (req, res) => users.updatePassword(req, res));
router.delete("/user", (req, res) => users.deleteUser(req, res));
router.get("/skills", (req, res) => users.getSkills(req, res));
router.get("/freelancerSkills", (req, res) => users.getSkillsByFreelancer(req, res));
router.get("/usersMe", (req, res) => users.getUserMe(req, res));

// Post Controller Routes
router.get("/jobs", (req, res) => post.getJobs(req, res));
router.get("/job", (req, res) => post.getJobById(req, res));
router.get("/featuredJobs", (req, res) => post.getFeaturedPosts(req, res));
router.get("/clientJobs", (req, res) => post.getJobUsingClient(req, res));
router.get("/freelancerJobs", (req, res) => post.getJobUsingFreelancer(req, res));
router.get("/userJobs", (req, res) => post.getJobUsingUserId(req, res));
router.get("/skillsJobs", (req, res) => post.getJobUsingSkills(req, res));
router.post("/job", (req, res) => post.addJob(req, res));
router.put("/job", (req, res) => post.updateJob(req, res));
router.delete("/job", (req, res) => post.deleteJob(req, res));

// Chat cotroller Routes 
router.get("/chatrooms", (req, res) => chat.getChatrooms(req, res))
router.post("/chatrooms", (req, res) => chat.addChatroom(req, res))
router.post("/userChatrooms", (req, res) => chat.addUserChatroom(req, res))
router.post("/messages", (req, res) => chat.addMessage(req, res))
router.get("/messages", (req, res) => chat.getMessages(req, res))

// Saved Posts Routes
router.get("/savedPosts", (req, res) => savedPost.getsavedPosts(req, res))
router.get("/savedPostsByUserId", (req, res) => savedPost.getsavedPostsByUserId(req, res))
router.route("/savedPost")
.put((req, res) => savedPost.savedPost(req, res))
.post((req, res) => savedPost.savedPost(req, res));

// Disputes Routes
router.get("/disputes", (req, res) => dispute.getDisputes(req, res))
router.get("/activeDisputes", (req, res) => dispute.getActiveDispute(req, res))
router.get("/closedDisputes", (req, res) => dispute.getClosedDispute(req, res))
router.get("/disputeComplains", (req, res) => dispute.getDisputeComplains(req, res))
router.post("/dispute", (req, res) => dispute.addDispute(req, res))
router.post("/disputeComplain", (req, res) => dispute.addDisputeComplains(req, res))
router.put("/disputeStatus", (req, res) => dispute.updateDisputeStatus(req, res))
router.delete("/dispute", (req, res) => dispute.deleteDispute(req, res))

// Proposal Routes
router.get("/proposals", (req, res) => proposal.getProposals(req, res))
router.post("/proposals", (req, res) => proposal.addProposal(req, res))
router.get("/proposalsByUser", (req, res) => proposal.getProposalByUserId(req, res))
router.get("/proposalsByJob", (req, res) => proposal.getProposalByJobId(req, res))
router.get("/receivedProposals", (req, res) => proposal.getReceivedProposals(req, res))
router.put("/proposal", (req, res) => proposal.updateProposalStatus(req, res))

// Contract Routes
router.get("/contracts", (req, res) => contract.getContracts(req, res))
router.get("/cancelContracts", (req, res) => contract.getCancelContracts(req, res))
router.get("/contract", (req, res) => contract.getContractById(req, res))
router.get("/contractsByProposalIds", (req, res) => contract.getContractsByProposalIds(req, res))
router.post("/cancelContractReq", (req, res) => contract.addCancelContract(req, res))
router.put("/updateCancelContractStatus", (req, res) => contract.updateCancelContractStatus(req, res))
router.put("/updateCompleteContractStatus", (req, res) => contract.updateCompleteContractStatus(req, res))

// Review Routes
router.get("/reviews", (req, res) => review.getReviews(req, res))
router.get("/recivedReview", (req, res) => review.getRecivedUserReview(req, res))
router.get("/sendReview", (req, res) => review.getSendUserReview(req, res))
router.get("/checkReviewByUserIdAndJobId", (req, res) => review.getReviewWithUserIdAndJobId(req, res))
router.post("/review", (req, res) => review.addReview(req, res))

// Form Routes
router.get("/forms", (req, res) => form.getForms(req, res));
// router.get("/formsUser", (req, res) => form.getFormsWithUsers(req, res));
router.get("/form", (req, res) => form.getSingleForm(req, res));
router.post("/form", (req, res) => form.addForm(req, res));
router.put("/live", (req, res) => form.updateLive(req, res));
router.put("/form", (req, res) => form.updateForm(req, res));
router.delete("/form", (req, res) => form.deleteForm(req, res));

// Question Routes
router.get("/questions", (req, res) => question.getQuestions(req, res));
router.get("/questionsForm", (req, res) => question.getQuestionWithForm(req, res));
router.get("/quesAns", (req, res) => question.getQuestionWithAns(req, res));
router.get("/question", (req, res) => question.getSingleQuestion(req, res));
router.post("/question", (req, res) => question.addQuestion(req, res));
router.put("/question", (req, res) => question.updateQuestion(req, res));
router.delete("/question", (req, res) => question.deleteQuestion(req, res));

// Response Routes
router.get("/responses", (req, res) => response.getResponses(req, res));
router.get("/responsesQueAndForm", (req, res) => response.getResponseWithQueAndForm(req, res));
router.get("/response", (req, res) => response.getSingleFormWithResponse(req, res));
router.post("/response", (req, res) => response.addResponse(req, res));
router.put("/response", (req, res) => response.updateResponse(req, res));
router.delete("/response", (req, res) => response.deleteResponse(req, res));

//Admin Routes 
router.get("/usersByAdmin", (req, res) => admin.getAllUsers(req, res));
router.get("/allCountData", (req, res) => admin.getAllCountData(req, res));
router.get("/userByAdmin", (req, res) => admin.getSingleUserById(req, res));
router.put("/updateUserStatus", (req, res) => admin.updateUserStatus(req, res));




//Test
router.get('/test',  (req, res) => res.status(200).json('Docker is working'));
module.exports = router;
