// @ts-check
const owner = "program-think-mirrors"
const repo = "books"

/**
 * @param {string} ref 
 * @param {import('@octokit/rest').Octokit} github 
 */
async function readCommit(ref, github) {
    const { data } = await github.repos.getCommit({
        owner,
        repo,
        ref,
    })
    const treeSha = data.commit.tree.sha
    const commitId = data.sha
    return {
        treeSha,
        commitId,
    }
}

/**
 * @param {{ github: import('@octokit/rest').Octokit }} options 
 */
module.exports = async ({ github }) => {
    const { treeSha: baseTree, commitId: baseCommit } = await readCommit("master", github)
    const { commitId: history } = await readCommit("history", github)
    const { commitId: politics } = await readCommit("politics", github)

    const { data: { sha: resultTree } } = await github.git.createTree({
        owner,
        repo,
        base_tree: baseTree,
        tree: [
            {
                path: "历史",
                mode: "160000",
                type: "commit",
                sha: history,
            },
            {
                path: "政治",
                mode: "160000",
                type: "commit",
                sha: politics,
            },
        ]
    })

    const { data: { sha: resultCommit } } = await github.git.createCommit({
        owner,
        repo,
        message: new Date().toISOString().split("T")[0],
        tree: resultTree,
        parents: [baseCommit],
        author: {
            name: "program-think-mirrors",
            email: "program-think-mirrors@github.com",
        },
    })

    const { data } = await github.git.updateRef({
        owner,
        repo,
        ref: "heads/master",
        sha: resultCommit,
    })
    console.log(data)
}
