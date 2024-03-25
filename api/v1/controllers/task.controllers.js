const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

module.exports.index = async (req, res) => {
  const idUser = res.user.id;

  const { sortKey, sortValue } = req.query;
  let sort = {
    title: "asc",
  };

  const statusClient = req.query.status;

  const find = {
    $or:[
        {
            createdBy: idUser
        },{
            listUser: idUser
        }
    ],
    deleted: false,
  };

  // Bo loc theo trang thai
  const statusAccept = ["doing", "initial", "finish", "pending", "notFinish"];
  if (statusAccept.includes(statusClient)) {
    find["status"] = statusClient;
  }
  // Sap xep theo tieu chi
  if (sortKey & sortValue) {
    sort[sortKey] = sortValue;
  }

  // Pagination
  let initPagination = {
    currentPage: 1,
    limitItem: 2,
  };
  const itemTotal = await Task.countDocuments(find);
  objectPagination = paginationHelper(initPagination, req.query, itemTotal);

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword !== "" && objectSearch.regex !== "") {
    find["title"] = objectSearch.regex;
  }

  const tasks = await Task.find(find)
    .select("-deleted")
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.json({
    code: 200,
    tasks: tasks,
  });
};

module.exports.changeStatus = async (req, res) => {
  try {
    const idTask = req.params.idTask;
    const statusAccept = ["doing", "initial", "finish", "pending", "notFinish"];

    if (req.body && statusAccept.includes(req.body.status)) {
      const statusClient = req.body.status;
      await Task.updateOne(
        {
          _id: idTask,
        },
        {
          status: statusClient,
        }
      );
    }
    const task = await Task.findOne({
      _id: idTask,
    });
    res.json({
      code: 200,
      task: task,
    });
  } catch (error) {
    res.json({
      code: 400,
      error: error,
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  const { ids, changeName, changeValue } = req.body;

  switch (changeName) {
    case "status":
      await Task.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: changeValue,
        }
      );
      res.json({
        code: 200,
        message: "Update Success!",
      });
      break;
    case "delete":
      await Task.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
          deleteAt: Date.now(),
        }
      );
      res.json({
        code: 200,
        message: "Update Success!",
      });
      break;
    default:
      res.json({
        code: 400,
      });
      break;
  }
};

module.exports.create = async (req, res) => {
  const user = res.user;
  const objectTask = {
    createdBy: user.id,
    title: req.body.title,
    status: req.body.status,
    listUser: req.body.listUser,
    content: req.body.content,
    taskParenId: req.body.taskParenId,
    timeFinish: req.body.timeFinish,
    timeStart: req.body.timeStart || Date.now(),
  };
  const task = new Task(objectTask);
  await task.save();

  res.json({
    code: 200,
    task: task,
  });
};

module.exports.edit = async (req, res) => {
  try {
    const idTask = req.params.idTask;

    if (req.body) {
      await Task.updateOne(
        {
          _id: idTask,
        },
        req.body
      );
    }

    res.json({
      code: 200,
    });
  } catch (error) {
    res.json({
      code: 400,
      error: error,
    });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const idTask = req.params.idTask;
    await Task.updateOne(
      {
        _id: idTask,
      },
      {
        deleted: true,
        deleteAt: Date.now(),
      }
    );

    res.json({
      code: 200,
    });
  } catch (error) {
    res.json({
      code: 400,
      error: error,
    });
  }
};
