const NodeGit = require('nodegit');

const getRepo = (uri, dest, getCred) => {
  const cloneOpts = {};
  cloneOpts.fetchOpts = {
    callbacks: {
      credentials: getCred,
    },
  };
  const setCallbacks = (repo) => {
    const repository = repo;
    repository.callbacks = cloneOpts.fetchOpts.callbacks;
    return repo;
  };
  return NodeGit.Clone(uri, dest, cloneOpts)
    .then(setCallbacks)
    .catch((e) => {
      let repository;
      // exists and is not an empty directory
      if (e.errno === -4) {
        return NodeGit.Repository.open(dest)
          // fetch does not return repo, must store
          .then((repo) => { repository = repo; return repo; })
          .then(repo => repo.fetchAll(cloneOpts.fetchOpts))
          .then(() => repository.mergeBranches('master', 'origin/master'))
          .then(() => repository)
          .then(setCallbacks);
      }
      throw e;
    });
};

async function pushOrigin(repo) {
  const remoteRef = await repo.getRemote('origin');
  await remoteRef.push(['refs/heads/master:refs/heads/master'], {
    callbacks: repo.callbacks,
  });
}

module.exports = { getRepo, pushOrigin };
