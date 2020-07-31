const CourseModel = require('./model');

module.exports = {
  Create: async (req, res) => {
    try {
        await CourseModel.create(req.body);
        const courses = await CourseModel.find({});
        return res.status(200).json({
            status: "Successful!",
            message: "Successfully Created a course",
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  },
  List: async ( req, res ) => {
    try {
        const search = req.query.search === '' ? undefined : req.query.search;
        const filterTopic = req.query.tfilter === 'All' ? undefined : req.query.tfilter;
        const filterPrice = req.query.pfilter === '' ? undefined : parseFloat(req.query.pfilter);
        const sort = req.query.sort === 'Any' ? undefined : req.query.sort;
        const sortType = req.query.sorttype === 'Ascending' ? 1 : req.query.sorttype === 'Descending' ? -1 : undefined;
        let courses = [];
        let query = {};
        let sortQuery = null;
        
        if ( search ) {
            query.topic = new RegExp(search, "gi")
        }
        if ( filterTopic ) {
            query.topic = filterTopic;
        }

        if ( filterPrice ) {
            query.price = {
                $gte: filterPrice
            }
        }

        if ( sort === 'Topic' && sortType) {
            sortQuery = {
                topic: sortType
            }
        }
        else if ( sort === 'Price' && sortType ) {
            sortQuery = {
                price: sortType
            }
        }

        if (!sortQuery) {
            courses = await CourseModel.find(query);
        } else {
            courses = await CourseModel.find(query).sort(sortQuery);
        }

        return res.status(200).json({
            status: "Successfull",
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  },
  distict: async (req, res) => {
      try {
          const courses = await CourseModel.find({}).distinct("topic");
          return res.status(200).json({
              status: "Successful",
              data: courses
          });
      } catch (error) {
          return res.status(500).json({
              status: "Error",
              message: error.message
          });
      }
  }
}